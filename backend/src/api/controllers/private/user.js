import dbQuery from './../../../database/connection';
import { getCurrentDatetime, formatDatetime } from './../../utils/date';

export const getAccountDataController = async (req, res) => {
  const { IDUser } = req.user;

  // Primero, buscamos todas las salas de chat correspondiente al usuario
  let sql = await dbQuery(
    'SELECT DISTINCT messageRoom FROM messages WHERE messageOutgoingUserId = ? OR messageIncomingUserId = ?',
    [IDUser, IDUser]
  );
  // Id de las salas de chat activas para este usaurio
  const rooms = sql;

  // Array de los chats activos
  const activeChats = [];

  for (let i = 0; i < rooms.length; i++) {
    // Obtenemos los datos personales de usuario de cada chat y los guardamos en un objeto
    let sql = await dbQuery(
      'SELECT u.IDUser, u.userFullname, u.userAvatar, u.userStatus FROM users AS u INNER JOIN messages AS m ON u.IDUser = m.messageOutgoingUserId OR u.IDUser = m.messageIncomingUserId WHERE u.IDUser != ? AND m.messageRoom = ? LIMIT 1',
      [IDUser, rooms[i].messageRoom]
    );
    const { userFullname, userAvatar, userStatus } = sql[0];
    const user = {
      IDUser: sql[0].IDUser,
      userFullname,
      userAvatar,
      userStatus,
    };

    sql = await dbQuery(
      'SELECT m.* FROM users AS u INNER JOIN messages AS m ON u.IDUser = m.messageOutgoingUserId OR u.IDUser = m.messageIncomingUserId WHERE u.IDUser != ? AND messageRoom = ? ORDER BY m.IDMessage ASC',
      [IDUser, rooms[i].messageRoom]
    );

    // Antes pasabamos el sql directamente al array de active chats pero ahora le pasamos el objeto data
    const data = {
      user,
      chats: sql,
    };

    activeChats.push(data);
  }

  // Obtenemos el avatar de todos los usuarios con el que tenemos chat activo
  for (let i = 0; i < activeChats.length; i++) {
    activeChats[i].user.userAvatar = `data:image/png;base64,${Buffer.from(
      activeChats[i].user.userAvatar
    ).toString('base64')}`;
  }

  // Obtenemos la información de usuario y convertimos su avatar de buffer a imagen
  sql = await dbQuery(
    'SELECT userFullname, userAvatar FROM users WHERE IDUser = ?',
    IDUser
  );

  sql[0].userAvatar = `data:image/png;base64,${Buffer.from(
    sql[0].userAvatar
  ).toString('base64')}`;

  // Formateamos las fechas de cada mensaje antes de enviar al frontend
  for (let i = 0; i < activeChats.length; i++) {
    for (let x = 0; x < activeChats[i].chats.length; x++) {
      activeChats[i].chats[x].messageCreatedAt = formatDatetime(
        activeChats[i].chats[x].messageCreatedAt
      );
    }
  }

  res.status(200).json({ success: true, data: sql[0], activeChats });
};

export const findUserController = async (req, res) => {
  const { IDUser } = req.user;
  const { userFullname } = req.params;

  let sql = await dbQuery(
    `SELECT IDUser, userFullname, userAvatar, userStatus FROM users WHERE IDUser != ${IDUser} AND userFullname LIKE '${userFullname}%'`
  );

  for (let i = 0; i < sql.length; i++) {
    sql[i].userAvatar = `data:image/png;base64,${Buffer.from(
      sql[i].userAvatar
    ).toString('base64')}`;
  }

  // Hay coincidencias encontradas(usuarios)
  if (sql.length > 0) {
    res.status(200).json({ success: true, users: sql });
  }
};

export const sendMessageController = async (req, res) => {
  // ID de usuario emisor proveniente del jwt
  const { IDUser } = req.user;
  const { message, incomingUserId } = req.body;

  // Buscar si ya hay una sala de chat activa entre estos dos usuarios
  let sql = await dbQuery(
    'SELECT messageRoom FROM messages WHERE messageOutgoingUserId = ? AND messageIncomingUserId = ? OR  messageOutgoingUserId = ? AND messageIncomingUserId = ?',
    [IDUser, incomingUserId, incomingUserId, IDUser]
  );

  if (sql.length > 0) {
    // Si hay mensajes entre estos dos usuarios
    const newMessage = {
      messageRoom: sql[0].messageRoom,
      messageOutgoingUserId: IDUser,
      messageIncomingUserId: incomingUserId,
      messageText: message,
    };

    // Insertamos el mensaje
    sql = await dbQuery('INSERT INTO messages SET ?', newMessage);

    // Asignamos el último id al mensaje
    newMessage.IDMessage = sql.insertId;

    // Asignamos la fecha de creación del mensaje, siendo esta la actual
    newMessage.messageCreatedAt = getCurrentDatetime();

    return res.status(200).json({ success: true, newMessage });
  }

  if (sql.length === 0) {
    // No hay mensage entre estos dos usuarios - procedemos a crear una identificación de sala
    const date = new Date().getTime();

    // Obtenemos el id unico de sala
    let roomId = (Math.random() * (date - 0) + 0).toString();
    roomId = roomId.substr(1, 5);
    roomId = parseInt(roomId);

    const newMessage = {
      messageRoom: roomId,
      messageOutgoingUserId: IDUser,
      messageIncomingUserId: incomingUserId,
      messageText: message,
    };

    // Insertamos el mensaje
    sql = await dbQuery('INSERT INTO messages SET ?', newMessage);

    // Asignamos el último id al mensaje
    newMessage.IDMessage = sql.insertId;

    // Asignamos la fecha de creación del mensaje, siendo esta la actual
    newMessage.messageCreatedAt = getCurrentDatetime();

    res.status(200).json({ success: true, newMessage });
  }
};

// Controlador que devuelve la data de un usuario cuando se necesita abrir un nuevo chat
export const getUserDataController = async (req, res) => {
  const { IDUser } = req.body;

  const sql = await dbQuery(
    'SELECT userFullname, userAvatar, userStatus FROM users WHERE IDUser = ?',
    IDUser
  );

  sql[0].IDUser = IDUser;

  sql[0].userAvatar = `data:image/png;base64,${Buffer.from(
    sql[0].userAvatar
  ).toString('base64')}`;

  if (sql.length > 0) {
    res.status(200).json({ success: true, user: sql[0] });
  }
};
