import React, { useState } from 'react';
import styled from 'styled-components';
import Horse from './components/Horse';
import RaceButton from './components/RaceButton';

const Container = styled.div`
  text-align: center;
`;

const Track = styled.div`
  width: 80%;
  margin: 20px auto;
  position: relative;
  border: 1px solid #333;
  padding: 10px;
`;

const App = () => {
  const [positions, setPositions] = useState([0, 0, 0, 0]);

  const startRace = () => {
    const newPositions = positions.map(() => Math.random() * 80);
    setPositions(newPositions);
  };

  return (
    <Container>
      <h1>Horse Racing Game</h1>
      <Track>
        {positions.map((position, index) => (
          <Horse key={index} position={position} color={`#${Math.floor(Math.random() * 16777215).toString(16)}`} number={index + 1} animationDuration={Math.random() * 5 + 2} />
        ))}
      </Track>
      <RaceButton onClick={startRace} />
    </Container>
  );
};

export default App;
