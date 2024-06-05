import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";
import * as StompJs from "@stomp/stompjs";
import SockJS from "sockjs-client";
import styled from "styled-components";
import ChatRoom from "../../component/chat/ChatRoom";
import VideoStream from "../../component/chat/VideoStream";
import { pcConfig } from "../../component/config/pcConfig";

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
  overflow: auto;
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


const ServerPage = () => {
  const {id} = useParams();
  const username = new URLSearchParams(useLocation().search).get('username')
  const socket = new SockJS("/ws-stomp");
  const [serverInfo, setServerInfo] = useState(null); //서버 이름, 접속 유저

  const client = useRef({});
  const localStream = useRef();
  const localVideoRef = useRef(null);
  const sendPCRef = useRef();
  const receivePCsRef = useRef({});
  const [users, setUsers] = useState([]);

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [chatRooms, setChatRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState(''); //현재 채팅방 룸아이디, 이름 (기본 0)

  const [webChatopen, setWebChatOpen] = useState(true); //웹 채팅 부분 toggle
  
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
  
  const closeReceivePC = useCallback((id) => {
    if(!receivePCsRef.current[id]) return;
    receivePCsRef.current[id].close();
    delete receivePCsRef.current[id];
  }, []);

  const createSenderOffer = useCallback(async() => {
    if(sendPCRef.current) {
      try{
        const sdp = await sendPCRef.current.createOffer({
          offerToReceiveAudio: false,
          offerToReceiveVideo: false,
        });
        sendPCRef.current.setLocalDescription(new RTCSessionDescription(sdp));
        
        socket.current.publish({
          destination: `/pub/video/peer/offer/`,
          body: JSON.stringify({
            sdp: sdp,
            senderId: username,
            roomId: currentRoom.roomId
          })
        });
      } catch (e) {
        console.log(e);
      }
    }
  }, []);

  const createSenderAnswer = useCallback(async(pc, senderId) => {
    try {
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      //send the answer back to sender
      socket.current.publish({
        destination: `/pub/video/peer/answer`,
        body: JSON.stringify({
          sdp: answer,
          senderId: senderId,
          receiverId: username,
          roomId: currentRoom.roomId
        })
      });
    } catch (err) {
      console.log(err);
    }
  }, []);

  const createSenderPeerConnection = useCallback(() => {
    const pc = new RTCPeerConnection(pcConfig);
    pc.onicecandidate = (e) => {
      if(!(e.candidate && socket.current)) return;
      socket.current.publish({
        destination: `/pub/video/peer/candidate`,
        body: JSON.stringify({
          candidate: e.candidate,
          senderId: username,
        })
      });
    };
    pc.oniceconnectionstatechange = (e) => {
      console.log(e);
    };

    if(localStream.current) {
      localStream.current.getTracks().forEach((track) => {
        if(!localStream.current) return;
        pc.addTrack(track, localStream.current);
      });
    } else {
      console.log("no local stream");
    }
    sendPCRef.current = pc;
  }, []);

  const createReceiverOffer = useCallback(async (pc, senderSocketID) => {
    try{
      const sdp = await pc.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true,
      });
      pc.setLocalDescription(new RTCSessionDescription(sdp));
      if(!socket.current) return;

      socket.current.publish({
        destination: `/pub/video/peer/offer`,
        body: JSON.stringify({
          sdp: sdp,
          senderId: senderSocketID,
          receiverId: username,
          roomId: currentRoom.roomId
        })
      });
    } catch (err) {
      console.log(err);
    }
  }, []);

  const createReceiverPeerConnection = useCallback((socketId) => {
    try {
      const pc = new RTCPeerConnection(pcConfig);
      receivePCsRef.current = { ...receivePCsRef.current, [socketId]: pc};
      pc.onicecandidate = (e) => {
        if(!(e.candidate && socket.current)) return;
        socket.current.publish({
          destination: `/pub/video/peer/candidate`,
          body: JSON.stringify({
            candidate: e.candidate,
            receiverId: username,
            senderId: socketId,
            roomId: currentRoom.roomId
          })
        })
      };
      pc.oniceconnectionstatechange = (e) => {
        console.log(e);
      }
      pc.ontrack = (e) => {
        setUsers((oldUsers) => 
          oldUsers.filter((user) => user.id !== socketId).concat({
            id: socketId,
            stream: e.streams[0],
          })
        );
      };
      return pc;

    } catch (e) {
      console.error(e);
    }
  }, []);

  const createReceiverPC = useCallback((id) => {
      try {
        const pc = createReceiverPeerConnection(id);
        if(!socket.current || !pc) return;
        createReceiverOffer(pc, id);
      } catch (err) {
        console.log(err);
      }
    }, [createReceiverOffer, createReceiverPeerConnection]
  );

  //웹캠 오픈
  const startLocalStream = useCallback(async() => {
    if(navigator.mediaDevices !== undefined) {
      await navigator.mediaDevices.getUserMedia({
        audio: true, 
        video: {
          width: 330,
          height: 230
        },
      })
      .then(async (stream) => {
        console.log("stream found", stream);
        localStream.current = stream;
        localVideoRef.current.srcObject = stream;
        document.getElementById('videoLocal').srcObject = stream;
        if(!socket.current) return;
        //disable microphone default
        // stream.getAudioTracks()[0].enabled = true;
        createSenderPeerConnection();
        await createSenderOffer();
        
      })
      .catch(e => {
        console.log("Get User Media Error: ",e);
      });
        
    }
  }, [createSenderOffer, createSenderPeerConnection]);

  const subscribe = () => {
    client.current.subscribe(`/sub/chat/room/${currentRoom.roomId}`, function (message) {
      const newMessage = JSON.parse(message.body);
      console.log(newMessage);
      setMessages((prev => [...prev, newMessage]));
    });

    client.current.subscribe(`/sub/video/peer/offer/${currentRoom.roomId}`, function(data) {
      const body = JSON.parse(data.body);
      createReceiverPC(body.senderId);
      const pc = receivePCsRef.current[body.senderId];

      pc.setRemoteDescription(new RTCSessionDescription(body.sdp));
      createSenderAnswer(pc, body.senderId);
    });

    client.current.subscribe(`/sub/video/peer/answer/${currentRoom.roomId}`, async (data) => {
      try {
        const body = JSON.parse(data.body);
        const pc = receivePCsRef.current[body.senderId];

        if(!pc) return;
        await pc.setRemoteDescription(body.sdp);
        
      } catch (e) {
        console.log(e);
      }
    });

    client.current.subscribe(`/sub/video/peer/candidate/${currentRoom.roomId}`, async (data) => {
      try {
        const body = JSON.parse(data.body);
        const pc = receivePCsRef.current[body.senderId];
        if(!(pc && body.candidate)) return;
        await pc.addIceCandidate(new RTCIceCandidate(body.candidate));
      } catch (e) {
        console.log(e);
      }
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
        //연결되었으면 웹캠 실행 후 알림 주기
        startLocalStream();
        subscribe();
      },
      onStompError: frame => {
        console.error(frame);
      },
    });

    client.current.activate();
  };

  const disconnect = () => {
    client.current.deactivate();
    sendPCRef.current.close();
    users.forEach((user) => closeReceivePC(user.id));
  }

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
    return () => disconnect();
  }, [currentRoom]);

  if(!serverInfo) return null;
  return(
    <div style={{display: "flex", height: "100vh", width: "100vw"}}>
      <ChatRoom serverName={serverInfo.name} chatRooms={chatRooms}
                currentRoom={currentRoom} setChatRooms={setChatRooms} setCurrentRoom={setCurrentRoom} />
      <div style={{display: "flex", flex: "1", flexDirection: "column", height: "100vh"}}>
        <ChatHeader>
          <div className="title">
            <img src="/images/sharp.svg" alt="sharp"/>
            {currentRoom.name}
          </div>
          <div style={{display: "flex"}}>
            <button onClick={() => setWebChatOpen(!webChatopen)}><img src="/images/member.png" alt="member" width="20" height="auto"/></button>
            <button><img src="/images/logout.png" alt="logout" width="20" height="auto"/></button>
          </div>
        </ChatHeader>
        <div style={{display: "flex", flexGrow: "1"}}>
          <div style={{display: "flex", flexDirection: "column", flex: "1"}}>
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
          {webChatopen && <VideoStream users={users} localVideoRef={localVideoRef} />}
        </div>
      </div>
    </div>
  );
}

export default ServerPage;