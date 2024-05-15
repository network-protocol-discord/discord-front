import React from "react";
import ServerList from "../../component/chat/ServerList";
import NoChat from "../../component/chat/NoChat";

const MainPage = (props) => {
  return(
    <div style={{display: "flex", height: "100vh", width: "100vw"}}>
      <ServerList />
      <NoChat name={props.name}/>
    </div>
  );
}

export default MainPage;