import { createContext, useContext, useState, useEffect } from 'react';
import axios from './../utils/axios';

const AuthContext = createContext(null);

export const AuthContextProvider = (props) => {
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => sessionVerify(), []);

  const sessionVerify = async () => {
    try {
      const request = await axios.get('/api/auth');
      const { success, auth } = request.data;

      if (success === true) {
        setIsAuth(auth);
      }
    } catch (err) {
      console.log('Ocurrio un error con axios!');
    }
  };

  const value = {
    isAuth,
    setIsAuth,
  };

  return <AuthContext.Provider value={value} {...props} />;
};

export const useAuthContext = () => useContext(AuthContext);
