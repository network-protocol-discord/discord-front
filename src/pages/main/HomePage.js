import {React, useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import ReactModal from "react-modal";
import axios from "axios";
import styled from "styled-components";
const Background = styled.div`
  padding: 4rem;
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  background: white;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.div`
  padding: 1rem;
  font-size: 60px;
`;

const ServerBox = styled.div`
  width: 720px;
  padding: 1rem;
  flex-grow: 1;
  border: 1px solid black;
  display: flex;
  flex-direction: column;
`;

const ServerItem = styled.button`
  border-radius: 4px;
  padding: 8px;
  align-items: center;
  border: 1px solid black;
`;

const HomePage = () => {
  const [serverList, setServerList] = useState([]);
  const navigate = useNavigate('');
  const [selectedServerId, setSelectedServerId] = useState('');
  
  //현재 열려있는 서버들 불러오기
  useEffect(() => {
    axios.get('/server')
      .then(response => {
        setServerList(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalConfirmMessage, setModalConfirmMessage] = useState('');
  const [modalInput, setModalInput] = useState('');

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

  const onModalOpenButtonClick = ({message, confirmMessage, serverId}) => {
    setModalMessage(message);
    setModalConfirmMessage(confirmMessage);
    setSelectedServerId(serverId);
    setModalOpen(true);
  };

  const onModalConfirmButtonClick = () => {
    if(modalMessage === "서버 이름을 입력하세요") {
      
      //modalInput -> 서버 추가 post요청
      axios.post(`/server?name=${modalInput}`)
        .then(res => {
          if(res.status === 200) {
            alert("서버를 생성했습니다!");
          }
        })
        .catch(e => console.log(e));

      setModalOpen(false);
      window.location.reload(); //새로고침
    } 
    else if(modalMessage === "참가 닉네임을 입력하세요"){

      // localStorage.setItem("username", modalInput);
      //modal close 없이 navigate 
      navigate(`/server/${selectedServerId}?username=${modalInput}`);
    }
  }
  const handleKeyPress = (e) => {
    if(e.key === 'Enter') {
      onModalConfirmButtonClick();
    }
  }
  return (
    <Background>
      <Title>Welcome To Discord Server!</Title>
      <ServerBox>
        <div style={{textAlign: "center", fontSize: "40px", position: "relative"}}>
          서버에 참가해보세요!
          <button style={{marginLeft: "auto", borderRadius: "4px", border: "1px solid black", left: "0"}} 
            onClick={() => onModalOpenButtonClick({message: "서버 이름을 입력하세요", confirmMessage: "추가"})}>서버 추가</button>
        </div>
        <div style={{justifyContent: "space-around"}}>
          {serverList.map((server, index) => (
            <ServerItem onClick={() => onModalOpenButtonClick({message: "참가 닉네임을 입력하세요", confirmMessage: "참가", serverId: server.serverId})}>
              <div style={{fontSize: 'x-large'}}>{server.name}</div>
              <div style={{fontSize: 'small'}}>참가 인원 : {server.users.length}명</div>
            </ServerItem>
          ))}
        </div>
      </ServerBox>
      <ReactModal
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}
        style={modalStyles}
        >
        <h2>{modalMessage}</h2>
        <input style={{width: "100%", height: "40px", borderRadius: "10px"}} value={modalInput}
              onChange={(e) => setModalInput(e.target.value)}
              onKeyDown={(e) => handleKeyPress(e)}/>
        <div style={{bottom: "0", display: "flex", justifyContent: "space-between",
               padding: "8px", borderTop: "1px solid black"}}>
          <button onClick={() => setModalOpen(false)}>닫기</button>
          <button onClick={onModalConfirmButtonClick}>{modalConfirmMessage}</button>
        </div>
      </ReactModal>
    </Background>
  );
}

export default HomePage;