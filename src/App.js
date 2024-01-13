import React, { useState } from 'react';
import styled from 'styled-components';
import RaceTrack from './components/RaceTrack';
import GameControls from './components/GameControls';
import RaceInfo from './components/RaceInfo';
import WinnerBanner from './components/WinnerBanner';

const Container = styled.div`
  text-align: center;
`;

const App = () => {
  const [horses, setHorses] = useState([
    { position: 0, color: '#ff0000', number: 1, animationDuration: 5 },
    { position: 0, color: '#00ff00', number: 2, animationDuration: 5 },
    { position: 0, color: '#0000ff', number: 3, animationDuration: 5 },
    // Add more horses as needed
  ]);

  const [winner, setWinner] = useState(null);

  const startRace = () => {
    const newHorses = horses.map(horse => ({
      ...horse,
      position: Math.random() * 80,
    }));
    setHorses(newHorses);
    setWinner(null);

    // Simulate race completion after a delay (adjust as needed)
    setTimeout(() => {
      const winningHorse = newHorses.reduce((prev, current) =>
        prev.position > current.position ? prev : current
      );
      setWinner(winningHorse.number);
    }, 5000); // 5 seconds delay
  };

  return (
    <Container>
      <h1>Horse Racing Game</h1>
      <RaceTrack horses={horses} />
      <GameControls onStartRace={startRace} />
      <RaceInfo winner={winner} />
      <WinnerBanner winner={winner} />
    </Container>
  );
};

export default App;
