import React from 'react';
import styled from 'styled-components';

const StatsContainer = styled.div`
  margin-top: 20px;
  font-size: 16px;
`;

const RaceStatistics = ({ horses }) => {
  const totalHorses = horses.length;

  const averagePosition = horses.reduce((sum, horse) => sum + horse.position, 0) / totalHorses;

  return (
    <StatsContainer>
      <h2>Race Statistics</h2>
      <p>Total Horses: </p>
      <p>Average Position: </p>
    </StatsContainer>
  );
};

export default RaceStatistics;
