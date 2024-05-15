import React from "react";
import styled from 'styled-components';

const BackgroundBlock = styled.div`
  height: 100%;
  width: calc(100% - 100px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const NoChat = (props) => {
  return(
    <BackgroundBlock>
      <img src="discord.svg" alt="discord" width="200" height="200" />
      <div style={{textAlign: "center", fontSize: "xx-large", marginTop: "20px"}}>{props.name}님 아직 서버가 없네요.<br/>서버를 추가하여 discord를 시작해보세요</div>
    </BackgroundBlock>
  );
}

export default NoChat;