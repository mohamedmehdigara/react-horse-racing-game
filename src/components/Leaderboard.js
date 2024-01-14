import React from 'react';
import styled from 'styled-components';

const LeaderboardContainer = styled.div`
  margin-top: 20px;
  font-size: 16px;
`;

const Leaderboard = ({ horses }) => {
  const sortedHorses = horses.slice().sort((a, b) => b.position - a.position);

  return (
    <LeaderboardContainer>
      <h2>Leaderboard</h2>
      <ul>
        {sortedHorses.map((horse, index) => (
          <li key={index}>{`Horse ${horse.number}: ${horse.position.toFixed(2)}%`}</li>
        ))}
      </ul>
    </LeaderboardContainer>
  );
};

export default Leaderboard;
