import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.post('/api/validateToken', { token });
          if (response.status === 200) {
            console.log(response.data);
            setAuth({ token, nickname: response.data.nickname, username: response.data.username });
          } else {
            handleLogout();
          }
        } catch (err) {
          handleLogout();
        }
      } else {
        handleLogout();
      }
    };

    const handleLogout = () => {
      localStorage.removeItem('token');
      setAuth(null);
      navigate('/login', {replace: true});
    };

    checkAuth();
    const interval = setInterval(checkAuth, 60000); // 1분마다 인증 확인
    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);