import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ServerList from "../../component/chat/ServerList";
import NoChat from "../../component/chat/NoChat";
import ChatRoom from "../../component/chat/ChatRoom";
import ChatList from "../../component/chat/ChatList";
const MainPage = () => {
  //임시 변수 (나중에 RequestBody로 받을 거임)

  const nickname = localStorage.getItem("nickname");
  const serverArr = ["apple", "banana"];
  const selectedServerIdx = 0;
  const chatRoomArr = ["Room1", "Room2", "Room3"];
  const chatArr = [
    { sender: 'Alice', time: '10:00 AM', msg: 'Hello!' },
    { sender: 'Bob', time: '10:05 AM', msg: 'Hi Alice!' },
    { sender: 'Alice', time: '10:06 AM', msg: 'How are you?' },
    { sender: 'Bob', time: '10:07 AM', msg: 'I am good, thank you!' },
    { sender: 'Alice', time: '10:00 AM', msg: 'Hello!' },
    { sender: 'Bob', time: '10:05 AM', msg: 'Hi Alice!' },
    { sender: 'Alice', time: '10:06 AM', msg: 'How are you?' },
    { sender: 'Bob', time: '10:07 AM', msg: 'I am good, thank you!' },
    { sender: 'Alice', time: '10:00 AM', msg: 'Hello!' },
    { sender: 'Bob', time: '10:05 AM', msg: 'Hi Alice!' },
    { sender: 'Alice', time: '10:06 AM', msg: 'How are you?' },
    { sender: 'Bob', time: '10:07 AM', msg: 'I am good, thank you!' },
    { sender: 'Alice', time: '10:00 AM', msg: 'Hello!' },
    { sender: 'Bob', time: '10:05 AM', msg: 'Hi Alice!' },
    { sender: 'Alice', time: '10:06 AM', msg: 'How are you?' },
    { sender: 'Bob', time: '10:07 AM', msg: 'I am good, thank you!' },
    { sender: 'Alice', time: '10:00 AM', msg: 'Hello!' },
    { sender: 'Bob', time: '10:05 AM', msg: 'Hi Alice!' },
    { sender: 'Alice', time: '10:06 AM', msg: 'How are you?' },
    { sender: 'Bob', time: '10:07 AM', msg: 'I am good, thank you!' },
  ];
  const navigate = useNavigate();
  const [auth, setAuth] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem("nickname");
    localStorage.removeItem("username");
    setAuth(null);
    navigate('/login');
  };

  //인증이 안되었으면 로그인 페이지로 이동 (1분마다 확인)
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      console.log(token);
      if (token) {
        try {
          const response = await axios.post('/api/validateToken', { token });
          if (response.status === 200) {
            console.log(response.data);
            setAuth({ token, username: response.data.username });
          } else {
            handleLogout();
          }
        } catch (err) {
          handleLogout();
        }
      } else {
        handleLogout();
      }
    };

    checkAuth();
    console.log(auth);
    const interval = setInterval(checkAuth, 60000); // 1분마다 인증 확인
    return () => clearInterval(interval);
  }, []);

  if(!auth) {
    return null;
  }
  return(
    <div style={{display: "flex", height: "100vh", width: "100vw"}}>
      <ServerList />
      <NoChat name={nickname} handleLogout={handleLogout}/>
      {/* <ServerList serverArr={serverArr} selectedIdx={selectedServerIdx}/>
      <ChatRoom name={nickname} serverName="My Server" chatRoomArr={chatRoomArr} selectedIdx={2}/>
      <ChatList channelName={chatRoomArr[2]} chatArr={chatArr}/> */}
    </div>
  );
}

export default MainPage;