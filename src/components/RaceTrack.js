import React from 'react';
import styled from 'styled-components';
import Horse from './Horse';

const TrackContainer = styled.div`
  width: 80%;
  margin: 20px auto;
  position: relative;
  border: 1px solid #333;
  padding: 10px;
`;

const RaceTrack = ({ horses }) => {
  return (
    <TrackContainer>
      {horses.map((horse, index) => (
        <Horse
          key={index}
          position={horse.position}
          color={horse.color}
          number={horse.number}
          animationDuration={horse.animationDuration}
        />
      ))}
    </TrackContainer>
  );
};

export default RaceTrack;
