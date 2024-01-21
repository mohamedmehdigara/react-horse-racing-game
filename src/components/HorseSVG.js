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
  width: 40px;
  height: 25px;
  background-color: ${props => props.color};
  border-radius: 10px 10px 5px 5px;
  position: relative;
`;

const HorseHead = styled.div`
  width: 25px;
  height: 20px;
  background-color: ${props => props.color};
  border-radius: 50%;
  position: absolute;
  top: -5px;
  left: 5px;
`;

const HorseEye = styled.div`
  width: 5px;
  height: 5px;
  background-color: #000;
  border-radius: 50%;
  position: absolute;
  top: 7px;
  left: 7px;
`;

const HorseEar = styled.div`
  width: 5px;
  height: 10px;
  background-color: ${props => props.color};
  border-radius: 50%;
  position: absolute;
  top: -2px;
  left: -2px;
  transform: rotate(-45deg);
`;

const HorseSVG = ({ position, color, animationDuration }) => {
  return (
    <HorseContainer position={position} animationDuration={animationDuration}>
      <HorseBody color={color}>
        <HorseHead color={color}>
          <HorseEye />
          <HorseEar color={color} />
        </HorseHead>
      </HorseBody>
    </HorseContainer>
  );
};

export default HorseSVG;