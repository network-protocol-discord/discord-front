import React from "react";
import { Link } from "react-router-dom";
import AuthTemplate from '../../component/auth/AuthTemplate';

const JoinPage = () => {
  return (
    <AuthTemplate>
      <div style={{ marginTop: "10px"}}>
        <div className="title" style={{textAlign: 'center', paddingBottom: "20px"}}>계정 만들기</div>
        <label for="id">아이디</label>
        <input id="id" type="text" />
        <div className="warning">이미 사용중인 아이디 입니다.</div>
        <label for="name" style={{marginTop: "20px"}}>사용자명</label>
        <input id="name" type="text" />
        <label for="pw" style={{marginTop: "20px"}}>비밀번호</label>
        <input id="pw" type="password" />
        <div className="warning">비밀번호는 특수문자 포함 6자 이상으로 해주세요.</div>
        <button style={{ marginTop: "25px"}}>가입하기</button>
        <Link to="/login">이미 계정이 있으신가요?</Link>
      </div>
    </AuthTemplate>
  );
}

export default JoinPage;