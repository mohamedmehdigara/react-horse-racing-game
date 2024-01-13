import React from 'react';
import styled from 'styled-components';

const InfoContainer = styled.div`
  margin-top: 20px;
  font-size: 16px;
`;

const RaceInfo = ({ winner }) => {
  return (
    <InfoContainer>
      {winner ? `Winner: Horse ${winner}` : 'Race in progress...'}
    </InfoContainer>
  );
};

export default RaceInfo;
