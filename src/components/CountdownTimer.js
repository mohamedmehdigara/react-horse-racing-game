import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const TimerContainer = styled.div`
  margin-top: 20px;
  font-size: 16px;
`;

const CountdownTimer = ({ seconds, onFinish }) => {
  const [timer, setTimer] = useState(seconds);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(prevTimer => {
        if (prevTimer === 0) {
          clearInterval(interval);
          onFinish();
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [onFinish]);

  return <TimerContainer>`Race starts in: ${timer} seconds`</TimerContainer>;
};

export default CountdownTimer;
