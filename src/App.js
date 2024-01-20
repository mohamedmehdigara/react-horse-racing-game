// Importing necessary libraries and components
import React, { useState } from 'react';
import styled from 'styled-components';

// Importing components from the components directory
import RaceTrack from './components/RaceTrack';
import GameControls from './components/GameControls';
import RaceInfo from './components/RaceInfo';
import WinnerBanner from './components/WinnerBanner';
import RaceHistory from './components/RaceHistory';
import Leaderboard from './components/Leaderboard';
import ResetButton from './components/ResetButton';
import CountdownTimer from './components/CountdownTimer';
import RaceStatistics from './components/RaceStatistics';

// Styled component for the main container
const Container = styled.div`
  text-align: center;
`;

// Main App component
const App = () => {
  // State for horses, winner, race history, and countdown
  const [horses, setHorses] = useState([
    { position: 0, color: '#ff0000', number: 1, animationDuration: 5 },
    { position: 0, color: '#00ff00', number: 2, animationDuration: 5 },
    { position: 0, color: '#0000ff', number: 3, animationDuration: 5 },
    // Add more horses as needed
  ]);
  const [winner, setWinner] = useState(null);
  const [raceHistory, setRaceHistory] = useState([]);
  const [countdownActive, setCountdownActive] = useState(false);

  // Function to start the race
  const startRace = () => {
    setCountdownActive(true);
  };

  // Function to handle countdown finish
  const onFinishCountdown = () => {
    const newHorses = horses.map(horse => ({
      ...horse,
      position: Math.random() * 80,
    }));
    setHorses(newHorses);
    setWinner(null);
    setCountdownActive(false);

    // Simulate race completion after a delay (adjust as needed)
    setTimeout(() => {
      const winningHorse = newHorses.reduce((prev, current) =>
        prev.position > current.position ? prev : current
      );
      setWinner(winningHorse.number);

      // Update race history
      setRaceHistory(prevHistory => [...prevHistory, `Race ${prevHistory.length + 1}: Horse ${winningHorse.number} wins`]);
    }, 5000); // 5 seconds delay
  };

  // Function to reset the race
  const resetRace = () => {
    setHorses(horses.map(horse => ({
      ...horse,
      position: 0,
    })));
    setWinner(null);
    setRaceHistory([]);
    setCountdownActive(false);
  };

  // Rendering UI components
  return (
    <Container>
      <h1>Horse Racing Game</h1>
      <RaceTrack horses={horses} />
      <GameControls onStartRace={startRace} />
      {countdownActive && <CountdownTimer seconds={3} onFinish={onFinishCountdown} />}
      <RaceInfo winner={winner} />
      <WinnerBanner winner={winner} />
      <RaceHistory history={raceHistory} />
      <Leaderboard horses={horses} />
      <ResetButton onReset={resetRace} />
      <RaceStatistics horses={horses}/>
      {/* Display other relevant information */}
    </Container>
  );
};

// Exporting the main App component
export default App;
