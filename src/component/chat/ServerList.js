import React from "react";
import styled from 'styled-components';

const ServerBlock = styled.div`
  width: 100px;
  height: 100%;
  padding: 10px;
  background: #e3e5e8;
  justify-content: center;
  align-items: center;
`;

const ServerItem = styled.button`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  cursor: pointer;
  &:hover {
    background: blue;
    border-radius: 25%;
    color: white;
  }
  .selected{
    background: blue;
    border-radius: 25%;
    color: white;
  }
`;

const ServerList = ({serverArr, selectedIdx}) => {
  const serverAdd = true;
  return(
    <ServerBlock>
      {serverArr.map((button, index) => (
        <ServerItem className={selectedIdx === index ? 'selected' : ''}>{button.charAt(0)}</ServerItem>
      ))}
      <ServerItem className={serverAdd ? 'selected': ''} style={{fontSize: "xxx-large"}}>+</ServerItem>
    </ServerBlock>
  );
}

ServerList.defaultProps = {
  serverArr: [],
  selectedIdx: 1
};

export default ServerList;