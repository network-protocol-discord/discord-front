import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import * as StompJs from "@stomp/stompjs";
import SockJS from "sockjs-client";
import styled from "styled-components";

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
    margin-left: 8px;
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

const ServerPage = () => {
  const username = localStorage.getItem('username');
  const {id} = useParams();
  const socket = new SockJS("/ws-stomp");
  const [serverInfo, setServerInfo] = useState(null); //서버 이름, 접속 유저

  const client = useRef(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [currentRoom, setCurrentRoom] = useState(''); //현재 채팅방 룸아이디, 이름 (기본 0)
  const navigate = useNavigate();
  
  useEffect(() => {
    axios.get(`/server/${id}`)
      .then(response => {
        setServerInfo(response.data);
        if (response.data.chatRooms && response.data.chatRooms.length > 0) {
          setCurrentRoom(response.data.chatRooms[0]);
        }
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  const subscribe = () => {
    client.current?.subscribe(`/sub/chat/room/${currentRoom.roomId}`, function (message) {
      const newMessage = JSON.parse(message.body);
      console.log(newMessage);
      setMessages((prev => [...prev, newMessage]));
    });
    client.current?.publish({
      destination: `/pub/chat/message`,
      body: JSON.stringify({
        type: 'ENTER',
        roomId: currentRoom.roomId,
        sender: username,
      })
    });

  };

  const connect = () => {
    client.current = new StompJs.Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000, // 자동 재 연결
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,

      onConnect: () => {
        console.log('success');
        subscribe();
      },
      onStompError: frame => {
        console.error(frame);
      },
    });
    client.current.activate();
  };

  const sendChat = () => {
    if(message.trim() !== '') {
      client.current?.publish({
        destination: `/pub/chat/message`,
        body: JSON.stringify({
          type: 'TALK',
          roomId: currentRoom.roomId,
          sender: username,
          message: message,
        })
      });
    } else {
      alert("채팅을 입력해주세요"); 
    }
  };

  const handleKeyPress = (e) => {
    if(e.key === 'Enter') {
      e.preventDefault();
      sendChat();
    }
  }

  const formatTime = (localdatetime) => {
    const date = new Date(localdatetime);
    // Extract hours and minutes
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    
    return `${hours}:${minutes}`;
  }

  useEffect(() => {
    //선택된 채팅방이 바뀔때마다 호출
    connect();
    setMessages([]);
    return () => client.current?.deactivate();
  }, [currentRoom]);

  if(!serverInfo || serverInfo.chatRooms.length === 0) return null;
  return(
    <div style={{display: "flex", height: "100vh", width: "100vw"}}>
      {/* <ServerList serverArr={serverArr} selectedIdx={selectedServerIdx}/> */}
      {/* <ChatRoom name={username} serverName={serverInfo.name} chatRoomArr={chatRooms} selectedRoom={roomId}/> */}
      <ChatRoomContainer>
        <ChatRoomHeader>
          <div className="title">{serverInfo.name}</div>
          <div style={{display: "flex"}}>
            <button><img src="/images/invite.png" alt="invite"/></button>
            <button><img src="/images/delete.svg" alt="delete"/></button>
          </div>
        </ChatRoomHeader>

        <ChatRoomList>
          <div style={{display: "flex", justifyContent: "space-between", marginTop: "1em"}}>
            <div>MEETING CHANNELS</div>
            <button><img src="/images/plus.svg" alt="invite"/></button>
          </div>
          {serverInfo.chatRooms.map((chatRoom, index) => (
            <ChatRoomItem key={chatRoom.roomId}
                className={chatRoom.roomId === currentRoom.roomId ? 'selected' : ''} 
                onClick={() => setCurrentRoom(chatRoom)}>
              <div style={{display: "flex"}}>
                <img src="/images/sharp.svg" alt="sharp" width="25" height="auto"/>
                <div style={{padding: "10% 10%", fontSize: "large"}}>{chatRoom.name}</div>
              </div>
              <button><img src="/images/delete.svg" alt="delete"/></button>
            </ChatRoomItem>
          ))}
        </ChatRoomList>
        <ChatRoomFooter>
          <button style={{display: "flex", border: "none", cursor: "pointer", width: "60%"}}>
            <img src="/images/discord-circle.png" alt="discord" width="37" height="auto"/>
            <div style={{padding: "5% 0", fontSize: "large", marginLeft: "8px"}}>{username}</div>
          </button>
          <div>
            <button style={{height: "100%"}}><img src="/images/mic.png" alt="mic"/></button>
            <button style={{height: "100%"}}><img src="/images/headset.png" alt="headset"/></button>
          </div>
        </ChatRoomFooter>
      </ChatRoomContainer>

      <div style={{display: "flex", flex: "1", flexDirection: "column", height: "100vh"}}>
        <ChatHeader>
          <div className="title">
            <img src="/images/sharp.svg" alt="sharp"/>
            {serverInfo.chatRooms[0].name}
          </div>
          <div style={{display: "flex"}}>
            <button><img src="/images/member.png" alt="member" width="20" height="auto"/></button>
            <button><img src="/images/logout.png" alt="logout" width="20" height="auto"/></button>
          </div>
        </ChatHeader>
        <ChatContainer>
          {messages.map((chat, index) =>(
            <ChatItem>
              <img src="/images/discord-circle.png" alt="discord"/>
              <div style={{marginLeft: "4px"}}>
                <div style={{display: "flex"}}>
                  <div className="sender">{chat.sender}</div>
                  <div className="time">{formatTime(chat.time)}</div>
                </div>
                <div className="msg">{chat.message}</div>
              </div>
            </ChatItem>
          ))}
        </ChatContainer>
        <MessageInput>
          <input placeholder={"Message #" + currentRoom.name} value={message} 
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => handleKeyPress(e)}/>
        </MessageInput>
      </div>
    </div>
  );
}

export default ServerPage;