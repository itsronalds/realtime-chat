import dbQuery from './../../../database/connection';
import { encryptPassword, decryptPassword } from './../../utils/bcrypt';
import { createToken } from './../../utils/jsonwebtoken';

export const initialAuthVerify = (req, res) => {
  if (!req.user) {
    return res.status(200).json({ success: true, auth: false });
  }

  if (req.user) {
    return res.status(200).json({ success: true, auth: true });
  }
};

export const signUpController = async (req, res) => {
  // Obtenemos los datos desde el frontend
  const { userFullname, userEmail, userPassword } = req.body;
  const { userAvatar } = req.files;

  // Primero, validamos que el usuario no exista para poder registrar
  let sql = await dbQuery(
    'SELECT userEmail FROM users WHERE userEmail = ?',
    userEmail
  );

  // Si es mayor a 0 es que hay un usuario
  if (sql.length > 0) {
    return res
      .status(200)
      .json({ success: false, message: 'The user is already registered' });
  }

  // Creamos un objeto con el nuevo usuario
  const newUser = {
    userFullname,
    userEmail,
    userPassword: await encryptPassword(userPassword),
    userAvatar: userAvatar.data,
  };

  // Insertamos en la bdd
  sql = await dbQuery('INSERT INTO users SET ?', newUser);
  const { affectedRows } = sql;

  // Petición con exito
  if (affectedRows === 1) {
    res
      .status(200)
      .json({ success: true, message: 'Registered user successfully!' });
  }
};

export const logInController = async (req, res) => {
  const { userEmail, userPassword } = req.body;

  // Verificamos si el usuario exite, si es así obtenemos la contraseña
  let sql = await dbQuery(
    'SELECT IDUser, userPassword, userStatus FROM users WHERE userEmail = ?',
    userEmail
  );

  // Si la longitud del array es igual a 0, no existe
  if (sql.length === 0) {
    return res
      .status(200)
      .json({ success: false, auth: false, message: 'Invalid credentials' });
  }

  const IDUser = sql[0].IDUser;
  const encryptedPassword = sql[0].userPassword;

  // Comparamos las contraseñas en caso que exista
  if ((await decryptPassword(userPassword, encryptedPassword)) !== true) {
    return res
      .status(200)
      .json({ success: false, auth: false, message: 'Invalid credentials' });
  }

  // Verificamos si ya el usuario esta conectado
  if (sql[0].userStatus === 1) {
    return res
      .status(200)
      .json({ success: false, auth: false, message: 'User is logged in' });
  }

  // Actualizamos el estado de usuario a online
  await dbQuery('UPDATE users SET userStatus = true WHERE IDUser = ?', IDUser);

  // En caso que todo sea correcto, creamos el token unico de sesión
  const data = {
    IDUser,
  };
  const token = createToken(data);

  // Enviamos la cookie al frontend
  res
    .status(200)
    .cookie('token', token, {
      httpOnly: false,
    })
    .json({ success: true, auth: true });
};

export const logOutController = async (req, res) => {
  if (req.user) {
    // Actualizamos el status de usuario a offline
    const { IDUser } = req.user;
    await dbQuery(
      'UPDATE users SET userStatus = false WHERE IDUser = ?',
      IDUser
    );

    res.status(200).clearCookie('token').json({ success: true, auth: false });
  }
};
