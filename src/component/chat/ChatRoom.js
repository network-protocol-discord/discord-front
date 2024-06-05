import {React, useState} from "react";
import { useParams, useLocation } from "react-router-dom";
import styled from 'styled-components';
import ReactModal from "react-modal";
import axios from "axios";

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
    width: "200px",
    height: "160px",
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

const ChatRoom = ({serverName, chatRooms, currentRoom, setCurrentRoom, setChatRooms}) => {
  const {id} = useParams();
  const name = new URLSearchParams(useLocation().search).get('username');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalInput, setModalInput] = useState('');

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

  return(
    <div style={{display: "flex"}}>
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
          <div className="title">{serverName}</div>
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
            <div style={{padding: "5% 0", fontSize: "large", marginLeft: "8px"}}>{name}</div>
          </button>
          <div>
            <button style={{height: "100%"}}><img src="/images/mic.png" alt="mic"/></button>
            <button style={{height: "100%"}}><img src="/images/headset.png" alt="headset"/></button>
          </div>
        </ChatRoomFooter>
      </ChatRoomContainer>
    </div>
  );
}

export default ChatRoom;