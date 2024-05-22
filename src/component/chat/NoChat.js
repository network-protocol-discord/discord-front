import React from "react";
import axios from "axios";
import styled from 'styled-components';

const BackgroundBlock = styled.div`
  height: 100vh;
  width: calc(100% - 100px);
  display: flex;
  flex-direction: column;
`;

const NoChatBody = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
const NoChat = ({name, handleLogout}) => {
  return(
    <BackgroundBlock>
      <div style={{display: "flex", padding: "1rem", borderBottom: "1px solid black", justifyContent: "end"}}>
        <button onClick={handleLogout}><img src="logout.png" alt="logout" width="30" height="30"/></button>
      </div>
      <NoChatBody>
        <img src="discord.svg" alt="discord" width="200" height="200" />
        <div style={{textAlign: "center", fontSize: "xx-large", marginTop: "20px"}}>{name}님 아직 서버가 없네요.<br/>서버를 추가하여 discord를 시작해보세요</div>
      </NoChatBody>
    </BackgroundBlock>
  );
}

export default NoChat;