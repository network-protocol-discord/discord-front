import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import ReactModal from "react-modal";
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
`;

const modalStyles = {
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    position: "fixed",
    width: "100%",
    height: "100vh",
    top: "0",
    left: "0",
    zIndex: 10,
  },
  content: {
    width: "300px",
    height: "200px",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    borderRadius: "10px",
    backgroundColor: "white",
    justifyContent: "center",
    padding: "8px",
  },
};

const ServerPage = () => {
  const {id} = useParams();
  const username = new URLSearchParams(useLocation().search).get('username')
  const socket = new SockJS("/ws-stomp");
  const [serverInfo, setServerInfo] = useState(null); //서버 이름, 접속 유저

  const client = useRef({});
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [chatRooms, setChatRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState(''); //현재 채팅방 룸아이디, 이름 (기본 0)
  const [modalOpen, setModalOpen] = useState(false);
  const [modalInput, setModalInput] = useState('');
  const navigate = useNavigate();
  
  useEffect(() => {
    axios.get(`/server/${id}`)
      .then(response => {
        setServerInfo(response.data);
        setCurrentRoom(response.data.chatRooms[0]);
        setChatRooms(response.data.chatRooms);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  const subscribe = () => {
    client.current.subscribe(`/sub/chat/room/${currentRoom.roomId}`, function (message) {
      const newMessage = JSON.parse(message.body);
      console.log(newMessage);
      setMessages((prev => [...prev, newMessage]));
    });
    client.current.publish({
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
      debug: function(str) {
        console.log(str);
      },
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
      setMessage('');
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

  const addChannel = async () => {
    try {
      const res = await axios.post(`/server/${id}/chat/room?name=${modalInput}`, {
        
      });
      if(res.status === 200) {
        setChatRooms((prev => [...prev, res.data]));
        setModalOpen(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

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
    return () => client.current.deactivate();
  }, [currentRoom]);

  if(!serverInfo) return null;
  return(
    <div style={{display: "flex", height: "100vh", width: "100vw"}}>
      <ReactModal
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}
        style={modalStyles}
        >
        <h2>채팅방 이름 입력</h2>
        <input id="channel-name" style={{width: "100%", height: "40px", borderRadius: "10px"}} 
              value={modalInput} onChange={(e) => setModalInput(e.target.value)} />
        <div style={{bottom: "0", display: "flex", justifyContent: "space-between",
               padding: "8px", borderTop: "1px solid black"}}>
          <button onClick={() => setModalOpen(false)}>닫기</button>
          <button onClick={() => addChannel()}>추가</button>
        </div>
      </ReactModal>
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
            <button onClick={() => setModalOpen(true)}><img src="/images/plus.svg" alt="invite"/></button>
          </div>
          {chatRooms.map((chatRoom, index) => (
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
            {currentRoom.name}
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