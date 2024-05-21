import React, { useState } from "react";
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";
import AuthTemplate from '../../component/auth/AuthTemplate';

const JoinPage = () => {
  const [username, setUsername] = useState('');
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async () => {
    try{
      const res = await axios.post('/signup', {
        username,
        nickname,
        email,
        password
      });
      if(res.status === 200) {
        alert("회원가입 성공!")
        navigate(`/login`);
      }
    } catch (err) {
      if(err.response) {
        setError(err.response.data.error);
      } else {
        setError('회원가입 중 오류가 발생했습니다.');
      }
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSignup();
    }
  };
  
  return (
    <AuthTemplate>
      <div style={{ marginTop: "10px"}}>
        <div className="title" style={{textAlign: 'center', paddingBottom: "20px"}}>계정 만들기</div>
        <label for="id">아이디</label>
        <input id="id" type="text" value={username} onChange={(e) => setUsername(e.target.value)} required/>
        {error === '이미 존재하는 아이디입니다.' && <div className="warning">이미 사용중인 아이디 입니다.</div>}
        <label for="name" style={{marginTop: "20px"}}>사용자명</label>
        <input id="name" type="text" value={nickname} onChange={(e) => setNickname(e.target.value)} required/>
        {error === '이미 존재하는 닉네임입니다.' && <div className="warning">이미 사용중인 닉네임 입니다.</div>}
        <label for="email" style={{marginTop: "20px"}}>이메일</label>
        <input id="email" type="text" onChange={(e) => setEmail(e.target.value)} required/>
        <label for="pw" style={{marginTop: "20px"}}>비밀번호</label>
        <input id="pw" type="password" onChange={(e) => setPassword(e.target.value)} required/>
        {/* <div className="warning">비밀번호는 특수문자 포함 6자 이상으로 해주세요.</div> */}
        <button style={{ marginTop: "25px"}} onClick={handleSignup}>가입하기</button>
        <Link to="/login">이미 계정이 있으신가요?</Link>
      </div>
    </AuthTemplate>
  );
}

export default JoinPage;