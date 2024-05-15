import styled from "styled-components";

const BackgroundBlock = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  background: white;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const GrayBox = styled.div`
  padding: 2rem;
  width: 720px;
  background: #f2f3f5;
  border-radius: 10px;
  border: 1px solid grey; 
  
  .title {
    font-weight: 600; 
    font-size: 32px;
    display: block;
    color: blue;
  }
  .warning{
    margin-top: 2px;
    font-size: 16px;
    display: block;
    color: red;
  }
  .text{
    font-size: 16px;
  }
  label{
    font-size: 16px;
    display: block;
  }
  a{
    color: blue;
    font-size: 16px;
  }
  input{
    display: block;
    width: 100%;
    height: 32px;
    font-size: 1rem;
    border: 1px solid black; 
    border-radius: 5px;
  }
  button{
    width: 100%;
    height: 40px;
    color: white;
    background: blue;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    cursor: pointer;
  }
`;

const AuthTemplate = ({children}) => {
  return (
    <BackgroundBlock>
      <GrayBox>
        {children}
      </GrayBox>
    </BackgroundBlock>
  );
}

export default AuthTemplate;
