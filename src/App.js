import React from 'react';
import {Route, Routes} from 'react-router-dom';
import LoginPage from './pages/login/LoginPage';
import JoinPage from './pages/join/JoinPage';
import ServerPage from './pages/main/ServerPage';
import HomePage from './pages/main/HomePage';

function App() {
  return (
    <Routes>
      {/* <Route path="/login" element={<LoginPage />} />
      <Route path="/join" element={<JoinPage />} /> */}
      <Route path="/" element={<HomePage/>} />
      <Route path="/server/:id" element={<ServerPage/>} />
    </Routes>
  );
}

export default App;
