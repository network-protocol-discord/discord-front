import React from "react";
import styled from 'styled-components';

const ServerBlock = styled.div`
  width: 50px;
  padding: 10px;
  background: #e3e5e8;
  justify-content: center;
  align-items: center;
`;

const ServerItem = styled.button`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  font-size: x-large;
  &:hover {
    background: blue;
    border-radius: 25%;
    color: white;
  }
  .selected{
    background: blue;
    color: white;
  }
  &+& {
    margin-top: 8px;
  }
`;

const ServerList = ({serverArr, selectedIdx}) => {
  const serverAdd = true;
  return(
    <ServerBlock>
      {serverArr.map((button, index) => (
        <ServerItem className={selectedIdx === index ? 'selected' : ''}>{button.charAt(0)}</ServerItem>
      ))}
      <ServerItem className={serverAdd ? 'selected': ''}>+</ServerItem>
    </ServerBlock>
  );
}

ServerList.defaultProps = {
  serverArr: [],
  selectedIdx: 0
};

export default ServerList;