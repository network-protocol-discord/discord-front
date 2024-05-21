import React from "react";
import styled from 'styled-components';

const ChatRoomContainer = styled.div`
  width: 300px;
  background: #f2f3f5;
  display: flex;
  flex-direction: column;
  button{
    overflow: hidden;
    cursor: pointer;
    border: none;
    img{
      display: block;
    }
    &:hover{
      background: #ebedef;
    }
  }
`
const ChatRoomHeader = styled.div`
  padding: 1em;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px grey solid;
  .title{
    font-size: x-large;
  }
`;

const ChatRoomList = styled.div`
  flex-grow: 1;
  padding: 1em 0.5em;
  color: #6a7480;
`;

const ChatRoomItem = styled.div`
  display: flex;
  justify-content: space-between;
  height: 40px;
  color: #6a7480;
  border-radius: 10%;
  padding: 4px;
  cursor: pointer;
  &:hover{
    background: #ebedef;
    color: black;
  }
  .selected{
    background: #ebedef;
    color: black;
  }
`
const ChatRoomFooter = styled.div`
  display: flex;
  justify-content: space-between;
  height: 40px;
  background: #ebedef;
  padding: 8px;
`;

const ChatRoom = ({name, serverName, chatRoomArr, selectedIdx}) => {
  return(
    <ChatRoomContainer>
      <ChatRoomHeader>
        <div className="title">{serverName}</div>
        <div style={{display: "flex"}}>
          <button><img src="invite.png" alt="invite"/></button>
          <button><img src="delete.svg" alt="delete"/></button>
        </div>
      </ChatRoomHeader>

      <ChatRoomList>
        <div style={{display: "flex", justifyContent: "space-between", marginTop: "1em"}}>
          <div>MEETING CHANNELS</div>
          <button><img src="plus.svg" alt="invite"/></button>
        </div>
        {chatRoomArr.map((chatRoom, index) => (
          <ChatRoomItem className={selectedIdx === index ? 'selected' : ''}>
            <div style={{display: "flex"}}>
              <img src="sharp.svg" alt="sharp" width="25" height="auto"/>
              <div style={{padding: "10% 10%", fontSize: "large"}}>{chatRoom}</div>
            </div>
            <button><img src="delete.svg" alt="delete"/></button>
          </ChatRoomItem>
        ))}
      </ChatRoomList>

      <ChatRoomFooter>
        <button style={{display: "flex", border: "none", cursor: "pointer", width: "60%"}}>
          <img src="discord-circle.png" alt="discord" width="37" height="auto"/>
          <div style={{padding: "5% 0", fontSize: "large", marginLeft: "8px"}}>{name}</div>
        </button>
        <div>
          <button style={{height: "100%"}}><img src="mic.png" alt="mic"/></button>
          <button style={{height: "100%"}}><img src="headset.png" alt="headset"/></button>
        </div>
      </ChatRoomFooter>
    </ChatRoomContainer>
  );
}

export default ChatRoom;