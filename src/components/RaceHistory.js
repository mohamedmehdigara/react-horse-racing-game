import React from 'react';
import styled from 'styled-components';

const HistoryContainer = styled.div`
  margin-top: 20px;
  font-size: 16px;
`;

const RaceHistory = ({ history }) => {
  return (
    <HistoryContainer>
      <h2>Race History</h2>
      <ul>
        {history.map((result, index) => (
          <li key={index}>{result}</li>
        ))}
      </ul>
    </HistoryContainer>
  );
};

export default RaceHistory;
