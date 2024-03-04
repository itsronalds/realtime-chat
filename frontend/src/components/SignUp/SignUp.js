import './SignUp.css';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from './../../utils/axios';

const SignUp = () => {
  const [data, setData] = useState({
    userFullname: '',
    userEmail: '',
    userPassword: '',
    userAvatar: '',
  });

  const signUp = async (e) => {
    e.preventDefault();

    const { userFullname, userEmail, userPassword, userAvatar } = data;
    const formData = new FormData();

    formData.append('userFullname', userFullname);
    formData.append('userEmail', userEmail);
    formData.append('userPassword', userPassword);
    formData.append('userAvatar', userAvatar);

    try {
      const request = await axios.post('/api/auth/signup', formData);
      const { success, message } = request.data;

      if (success === true) {
        setData({
          userFullname: '',
          userEmail: '',
          userPassword: '',
          userAvatar: '',
        });

        return alert(message);
      }

      alert(message);
    } catch (err) {
      console.log('Ocurrió un error!');
    }
  };

  const handleData = (e) => {
    const { name, value, files } = e.target;

    setData({
      ...data,
      [name]: !files ? value : files[0],
    });
  };

  return (
    <div className="signUp">
      <h2 className="signUp__title">Sign Up</h2>

      <form className="signUp__form" onSubmit={signUp}>
        <div className="signUp__formGroup">
          <input
            className="signUp__formInput"
            type="text"
            placeholder=" "
            name="userFullname"
            value={data.userFullname}
            onChange={(e) => handleData(e)}
          />
          <label className="signUp__formLabel">Full name</label>
        </div>

        <div className="signUp__formGroup">
          <input
            className="signUp__formInput"
            type="email"
            placeholder=" "
            name="userEmail"
            value={data.userEmail}
            onChange={(e) => handleData(e)}
          />
          <label className="signUp__formLabel">Email</label>
        </div>

        <div className="signUp__formGroup">
          <input
            className="signUp__formInput"
            type="password"
            placeholder=" "
            name="userPassword"
            value={data.userPassword}
            onChange={(e) => handleData(e)}
          />
          <label className="signUp__formLabel">Password</label>
        </div>

        <div className="signUp__formGroup signUp__formGroup--avatarBtn">
          <input
            className="signUp__formAvatarInput"
            type="file"
            name="userAvatar"
            onChange={(e) => handleData(e)}
          />
          <label className="signUp__formAvatarLabel">Avatar</label>
        </div>

        <button className="signUp__formBtn" type="submit">
          Sign Up
        </button>
      </form>

      <div className="signUp__goToLogin">
        <Link className="signUp__goToLoginLink" to="/">
          Do you have an account? Log In
        </Link>
      </div>
    </div>
  );
};

export default SignUp;
