import React from 'react';
import styled from 'styled-components';

const Button = styled.button`
  margin-top: 20px;
  padding: 10px 20px;
  font-size: 16px;
`;

const RaceButton = ({ onClick }) => {
  return <Button onClick={onClick}>Start Race</Button>;
};

export default RaceButton;
