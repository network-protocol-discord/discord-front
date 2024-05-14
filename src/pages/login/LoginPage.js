import React from "react";
import { Link } from "react-router-dom";
import AuthTemplate from '../../component/auth/AuthTemplate';

const LoginPage = () => {
  return (
    <AuthTemplate>
      <div style={{ display: "flex" }}>
        <div style={{ flex: "60%", flexDirection: "column"}}>
          <div className="title">돌아오신 것을 환영해요!</div>
          <div className="text">다시 만난다니 너무 반가워요!</div>
          <div style={{marginTop: "30px"}}>
            <label for="id">아이디</label>
            <input id="id" type="text" />
            <label for="pw" style={{marginTop: "10px"}}>비밀번호</label>
            <input id="pw" type="text" />
            <div className="warning">존재하지 않는 유저입니다.</div>
            <div style={{display: 'flex', marginTop: "10px"}}>
              <div className="text">계정이 필요한가요?</div>
              <Link to="/join">가입하기</Link>
            </div>
            <button>로그인</button>
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