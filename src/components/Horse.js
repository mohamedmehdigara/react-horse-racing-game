import React from 'react';
import styled, { keyframes } from 'styled-components';

const runAnimation = keyframes`
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(80%);
  }
`;

const HorseContainer = styled.div`
  position: absolute;
  top: 0;
  left: ${props => props.position}%;
  transform: translateX(-50%);
  animation: ${runAnimation} ${props => props.animationDuration || 5}s linear infinite;
`;

const HorseBody = styled.div`
  width: 20px;
  height: 20px;
  background-color: ${props => props.color};
  border-radius: 50%;
`;

const HorseLabel = styled.div`
  position: absolute;
  top: 30px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 12px;
  color: #333;
`;

const Horse = ({ position, color, number, animationDuration }) => {
  return (
    <HorseContainer position={position} animationDuration={animationDuration}>
      <HorseBody color={color} />
      <HorseLabel>{number}</HorseLabel>
    </HorseContainer>
  );
};

export default Horse;
