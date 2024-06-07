import React, { useEffect } from "react";
import styled from "styled-components";

const VideoChatContainer = styled.div`
  padding: 1rem;
`;

const VideoBox = styled.video`
  width: 330px;
  height: 230px;
  border: none;
  border-radius: 1rem;
  padding: 1rem;
  background: #7c87f5;
  display: flex; /* Flex 컨테이너로 설정 */
  flex-direction: column; /* Flex 방향을 컬럼으로 설정 */
  justify-content: flex-end; /* 주축을 기준으로 하위 요소들을 끝에 정렬 */
  .name {
    width: 50px;
    height: 20px;
    padding: 4px;
    background-color: rgba(0, 0, 0, 0.5);
    color: white;
    text-align: center;
    border: none;
    border-radius: 4px;
  }
  .mic {
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 50%;
    width: 40px;
    height: 40px;
    align-items: center;
    display: flex; /* Flex 컨테이너로 설정 */
    justify-content: center; /* 하위 요소를 중앙 정렬 */
  }
`;

const VideoDisableButton = styled.button`
  width: 80px;
  height: 80px;
  align-items: center;
  background: #ab342e;
  border: none;
  border-radius: 50%;
  display: flex;
  justify-content: center;
`;

const VideoStream = ({myKey, localVideoRef}) => {
  
  return(
    <VideoChatContainer>
      <div style={{height: "600px", overflowY: "auto"}}>
        <VideoBox ref={localVideoRef} autoPlay muted/>
        <div id="remote-stream"></div>
      </div>
      <div style={{display: "flex", marginTop: "1rem", justifyContent: "center"}}>
        <VideoDisableButton>
          <img src="/images/disable.png" alt="disable" />
        </VideoDisableButton>
      </div>
    </VideoChatContainer>
  );
}

export default VideoStream;