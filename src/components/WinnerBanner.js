import React from 'react';
import styled from 'styled-components';

const BannerContainer = styled.div`
  margin-top: 20px;
  padding: 10px;
  background-color: #5cb85c;
  color: #fff;
  font-size: 18px;
`;

const WinnerBanner = ({ winner }) => {
  return <BannerContainer>{winner && `Winner: Horse ${winner}`}</BannerContainer>;
};

export default WinnerBanner;
