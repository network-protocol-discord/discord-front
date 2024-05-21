import React, {useEffect, useState} from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import AuthTemplate from '../../component/auth/AuthTemplate';

const LoginPage = () => {
  const [username, setUserame] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const naviagate = useNavigate();
  const handleLogin = async () => {
    try {
      const response = await axios.post('/api/authenticate', {
        username,
        password
      });

      if (response.status === 200) {
        console.log(response.data.token);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("nickname", response.data.nickname);
        localStorage.setItem("username", response.data.username);
        naviagate("/");
      }
    } catch (err) {
      if (err.response.status === 401) {
        setError('존재하지 않는 유저입니다.');
      } else {
        setError('로그인 중 오류가 발생했습니다.');
      }
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <AuthTemplate>
      <div style={{ display: "flex" }}>
        <div style={{ flex: "60%", flexDirection: "column"}}>
          <div className="title">돌아오신 것을 환영해요!</div>
          <div className="text">다시 만난다니 너무 반가워요!</div>
          <div style={{marginTop: "30px"}}>
            <label for="id" onChange>아이디</label>
            <input id="id" type="text" value={username} onChange={(e) => setUserame(e.target.value)} onKeyDown={(e) => handleKeyPress(e)} required/>
            <label for="pw" style={{marginTop: "10px"}}>비밀번호</label>
            <input id="pw" type="password" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => handleKeyPress(e)} required/>
            {error === '존재하지 않는 유저입니다.' && <div className="warning">존재하지 않는 유저입니다.</div>}
            <div style={{display: 'flex', marginTop: "10px"}}>
              <div className="text">계정이 필요한가요?</div>
              <Link to="/join">가입하기</Link>
            </div>
            <button onClick={handleLogin}>로그인</button>
          </div>
        </div>
        <div style={{width: "40%", display: "flex", justifyContent: "center", alignItems: "center"}}>
          <img src="discord.svg" alt="logo" height="150" width="150"/>
        </div>
      </div>
    </AuthTemplate>
  );
}

export default LoginPage;