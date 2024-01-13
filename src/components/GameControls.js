import React from 'react';
import styled from 'styled-components';
import RaceButton from './RaceButton';

const ControlsContainer = styled.div`
  margin-top: 20px;
`;

const GameControls = ({ onStartRace }) => {
  return (
    <ControlsContainer>
      <RaceButton onClick={onStartRace} />
      {/* Add more controls as needed */}
    </ControlsContainer>
  );
};

export default GameControls;
