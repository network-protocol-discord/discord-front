import React from "react";
import axios from "axios";
import styled from "styled-components";

const ChatHeader = styled.div`
  padding: 1em;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px grey solid;
  .title{
    font-size: x-large;
  }
  button{
    background: #f2f3f5;
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
`;

const ChatContainer = styled.div`
  overflow: scroll;
  padding: 1rem;
  flex: 1;
  position: relative;
`;

const ChatItem = styled.div`
  display: flex;
  .sender{
    font: bold;
  }
  .time{
    marginLeft: 4px;
    font-size: small;
    color: grey;
  }
  .msg{
    margin-top: 4px;
  }
  &+&{
    margin-top: 1rem;
  }
`;

const MessageInput = styled.div`
  padding: 1rem;
  bottom: 0;
  input{
    width: 100%;
    height: 40px;
    border-radius: 1em;
    border: none;
    background: #ebedef;
  }
`

const ChatList = ({channelName, chatArr}) => {

  return (
    <div style={{display: "flex", flex: "1", flexDirection: "column", height: "100vh"}}>
      <ChatHeader>
        <div className="title">
          <img src="sharp.svg" alt="sharp"/>
          {channelName}
        </div>
        <div style={{display: "flex"}}>
          <button><img src="member.png" alt="member" width="20" height="auto"/></button>
          <button><img src="logout.png" alt="logout" width="20" height="auto"/></button>
        </div>
      </ChatHeader>
      <ChatContainer>
        {chatArr.map((chat, index) =>(
          <ChatItem>
            <img src="discord-circle.png" alt="discord"/>
            <div style={{marginLeft: "4px"}}>
              <div style={{display: "flex"}}>
                <div className="sender">{chat.sender}</div>
                <div className="time">{chat.time}</div>
              </div>
              <div className="msg">{chat.msg}</div>
            </div>
          </ChatItem>
        ))}
      </ChatContainer>
      <MessageInput>
        <input placeholder={"Message #" + channelName} />
      </MessageInput>
    </div>
  );
}

export default ChatList;