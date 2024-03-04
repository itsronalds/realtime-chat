import './LogIn.css';
import { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useAuthContext } from './../../contexts/AuthContext';
import axios from './../../utils/axios';

const LogIn = () => {
  const { setIsAuth } = useAuthContext();
  const [data, setData] = useState({
    userEmail: '',
    userPassword: '',
  });

  const history = useHistory();

  const logIn = async (e) => {
    e.preventDefault();

    try {
      const request = await axios.post('/api/auth/login', data);
      const { success, auth, message } = request.data;

      if (success === true) {
        history.push('/feed');

        return setIsAuth(auth);
      }

      if (success !== true) {
        alert(message);

        setIsAuth(auth);
      }
    } catch (err) {
      console.log('Ocurrio un error con axios');
    }
  };

  const handleData = (e) => {
    const { name, value } = e.target;

    setData({
      ...data,
      [name]: value,
    });
  };

  return (
    <div className="logIn">
      <h2 className="logIn__title">Log In</h2>

      <form className="logIn__form" onSubmit={logIn}>
        <div className="logIn__formGroup">
          <input
            className="logIn__formInput"
            type="email"
            placeholder=" "
            name="userEmail"
            onChange={(e) => handleData(e)}
          />
          <label className="logIn__formLabel">Email</label>
        </div>

        <div className="logIn__formGroup">
          <input
            className="logIn__formInput"
            type="password"
            placeholder=" "
            name="userPassword"
            onChange={(e) => handleData(e)}
          />
          <label className="logIn__formLabel">Password</label>
        </div>

        <button className="logIn__formBtn" type="submit">
          Sign Up
        </button>
      </form>

      <div className="logIn__goToLogin">
        <Link className="logIn__goToLoginLink" to="/signup">
          Do you have an account? Sign Up
        </Link>
      </div>
    </div>
  );
};

export default LogIn;
