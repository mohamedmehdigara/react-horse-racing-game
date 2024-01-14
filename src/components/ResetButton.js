import React from 'react';
import styled from 'styled-components';

const Button = styled.button`
  margin-top: 20px;
  padding: 10px 20px;
  font-size: 16px;
`;

const ResetButton = ({ onReset }) => {
  return <Button onClick={onReset}>Reset Race</Button>;
};

export default ResetButton;
