import React from 'react';



const WinnerBanner = ({ winner }) => {
  return (
    <div>
      {winner !== null && (
        <p>
          Congratulations to Horse {winner}! You are the winner!
        </p>
      )}
    </div>
  );
};

export default WinnerBanner;
