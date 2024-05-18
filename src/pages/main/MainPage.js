import React from "react";
import ServerList from "../../component/chat/ServerList";
import NoChat from "../../component/chat/NoChat";
import ChatRoom from "../../component/chat/ChatRoom";
import ChatList from "../../component/chat/ChatList";

const MainPage = ({name}) => {
  //임시 변수 (나중에 RequestBody로 받을 거임)
  const serverArr = ["apple", "banana"];
  const selectedServerIdx = 0;
  const chatRoomArr = ["Room1", "Room2", "Room3"];
  const chatArr = [
    { sender: 'Alice', time: '10:00 AM', msg: 'Hello!' },
    { sender: 'Bob', time: '10:05 AM', msg: 'Hi Alice!' },
    { sender: 'Alice', time: '10:06 AM', msg: 'How are you?' },
    { sender: 'Bob', time: '10:07 AM', msg: 'I am good, thank you!' }
  ];

  return(
    <div style={{display: "flex", height: "100vh", width: "100vw"}}>
      {/* <ServerList />
      <NoChat name={name}/> */}
      <ServerList serverArr={serverArr} selectedIdx={selectedServerIdx}/>
      <ChatRoom name={name} serverName="My Server" chatRoomArr={chatRoomArr} selectedIdx={2}/>
      <ChatList channelName={chatRoomArr[2]} chatArr={chatArr}/>
    </div>
  );
}

export default MainPage;