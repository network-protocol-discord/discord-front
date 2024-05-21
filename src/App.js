import React from 'react';
import {Route, Routes} from 'react-router-dom';
import LoginPage from './pages/login/LoginPage';
import JoinPage from './pages/join/JoinPage';
import MainPage from './pages/main/MainPage';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/join" element={<JoinPage />} />
      <Route path="/" element={<MainPage />} />
    </Routes>
  );
}

export default App;
