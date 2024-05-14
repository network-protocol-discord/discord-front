import React from "react";
import styled from 'styled-components';

const ChatRoomHeader = styled.div`
  width: 100%;
  height: 80px;
  padding: 1em;
  background: #f2f3f5;
  display: flex;
  border-bottom: 1px grey solid;
  .title{
    font-weight: bold;
    font-size: large;
  }
`;

const ChatRoomList = styled.div`
  width: 100%;
  height: calc(100% - 160px);
  padding: 8px 2px;
  background: #f2f3f5;
  .title{
    font-weight: bold;
    color: #6a7480;
  }
`;

const ChatRoomItem = styled.button`
  width: 100%;
  height: 80px;
  color: #6a7480;
  border-radius: 2px;
  padding: 1px;
  display: flex;
  &:hover{
    color: black;
    background: #d3d7db;
  }
`
const ChatRoomFooter = styled.div`
  width: 100%;
  background: #ebedef;
  padding: 2px;
`;

const ChatRoom = ({serverName, chatRoomArr, selectedIdx}) => {
  return(
    <div style={{width: "500px", height: "100%"}}>
      <ChatRoomHeader>
        <div className="title">{serverName}</div>
        <div style={{display: "flex", float: "right"}}>
          <button style={{backgroundImage: 'url("invite.png")'}}></button>
          <button style={{backgroundImage: 'url("delete.svg")'}}></button>
        </div>
      </ChatRoomHeader>
      <ChatRoomList>
        {chatRoomArr.map((chatRoom, index) => {
          <ChatRoomItem>
            <img src="sharp.svg" alt="sharp" height="100" width="100"/>
            <div>{chatRoom}</div>
            <img src="delete.svg" alt="sharp" height="100" width="100" style={{float: "right"}}/>
          </ChatRoomItem>
        })}
      </ChatRoomList>
      <ChatRoomFooter />
    </div>

  )
}

export default ChatRoom;