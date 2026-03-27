import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled, { keyframes, createGlobalStyle } from 'styled-components';

// --- Global Styles ---
const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    background: #020617;
    font-family: 'Montserrat', sans-serif;
    color: #f8fafc;
    overflow: hidden;
  }
`;

// --- The "Physics" of the Gallop ---

// The body must lunge and compress to show power
const lungeAndCompress = keyframes`
  0%, 100% { transform: scaleX(1) translateY(0) rotate(-2deg); }
  35% { transform: scaleX(1.15) translateY(-12px) rotate(4deg); }
  70% { transform: scaleX(0.95) translateY(2px) rotate(-1deg); }
`;

// Elliptical motion for the front legs (reaching)
const frontGait = keyframes`
  0% { transform: rotate(-45deg) translateY(0) translateX(0); }
  25% { transform: rotate(10deg) translateY(-8px) translateX(5px); }
  50% { transform: rotate(60deg) translateY(0) translateX(0); }
  75% { transform: rotate(10deg) translateY(4px) translateX(-2px); }
  100% { transform: rotate(-45deg) translateY(0) translateX(0); }
`;

// Elliptical motion for the back legs (pushing)
const backGait = keyframes`
  0% { transform: rotate(50deg) translateY(0) translateX(0); }
  25% { transform: rotate(-5deg) translateY(4px) translateX(-3px); }
  50% { transform: rotate(-55deg) translateY(0) translateX(0); }
  75% { transform: rotate(-5deg) translateY(-8px) translateX(5px); }
  100% { transform: rotate(50deg) translateY(0) translateX(0); }
`;

// --- Styled Components ---
const Stage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 50px 20px;
  height: 100vh;
`;

const TrackBoard = styled.div`
  width: 100%;
  max-width: 1100px;
  background: linear-gradient(180deg, #166534 0%, #14532d 100%);
  border: 15px solid #451a03;
  border-radius: 30px;
  position: relative;
  box-shadow: 0 40px 100px rgba(0,0,0,0.8);
  overflow: hidden;
`;

const Lane = styled.div`
  height: 120px;
  border-bottom: 3px solid rgba(255,255,255,0.05);
  display: flex;
  align-items: center;
  position: relative;
  &:last-child { border-bottom: none; }
`;

const FinishLine = styled.div`
  position: absolute;
  right: 100px;
  top: 0;
  bottom: 0;
  width: 30px;
  background: repeating-linear-gradient(0deg, #fff, #fff 15px, #000 15px, #000 30px);
  box-shadow: -5px 0 15px rgba(0,0,0,0.4);
  z-index: 1;
`;

const HorseEntity = styled.div.attrs(props => ({
  style: { left: `${props.progress}%` }
}))`
  position: absolute;
  width: 110px;
  height: 80px;
  transition: left 0.1s linear;
  z-index: 10;
`;

const MuscularBody = styled.div`
  width: 70px;
  height: 40px;
  background: ${props => props.color};
  border-radius: 35% 65% 30% 35%;
  position: relative;
  box-shadow: inset -5px -5px 15px rgba(0,0,0,0.2);
  animation: ${props => props.active ? lungeAndCompress : 'none'} ${props => 0.4 / props.v}s infinite ease-in-out;
`;

const AnatomicalHead = styled.div`
  width: 35px;
  height: 22px;
  background: ${props => props.color};
  position: absolute;
  right: -22px;
  top: -15px;
  border-radius: 8px 22px 5px 12px;
  transform: rotate(12deg);
  &::after { /* The Mane */
    content: '';
    position: absolute;
    left: 2px;
    top: -5px;
    width: 20px;
    height: 10px;
    background: rgba(0,0,0,0.3);
    border-radius: 50% 0 0 50%;
  }
`;

const LegSegment = styled.div`
  position: absolute;
  width: 7px;
  height: 26px;
  background: ${props => props.color};
  border-radius: 4px;
  transform-origin: top;
  animation: ${props => (props.front ? frontGait : backGait)} 
             ${props => 0.4 / props.v}s infinite linear;
  animation-play-state: ${props => props.active ? 'running' : 'paused'};
  animation-delay: ${props => props.delay}s;
`;

const UIControls = styled.div`
  margin-top: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

const BigButton = styled.button`
  padding: 20px 60px;
  font-size: 1.5rem;
  font-weight: 900;
  text-transform: uppercase;
  color: #020617;
  background: #f59e0b;
  border: none;
  border-radius: 15px;
  cursor: pointer;
  box-shadow: 0 6px 0 #b45309;
  transition: transform 0.1s;
  &:active { transform: translateY(4px); box-shadow: none; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

// --- Simulation Logic ---
const HORSES_DATA = [
  { id: 1, name: "Inferno", color: "#dc2626", stamina: 0.92 },
  { id: 2, name: "Tsunami", color: "#2563eb", stamina: 0.88 },
  { id: 3, name: "Quicksilver", color: "#94a3b8", stamina: 0.95 },
  { id: 4, name: "Obsidian", color: "#4b5563", stamina: 0.90 },
];

const App = () => {
  const [horses, setHorses] = useState(HORSES_DATA.map(h => ({ ...h, pos: 0, v: 0, wins: 0 })));
  const [isRacing, setIsRacing] = useState(false);
  const [winner, setWinner] = useState(null);
  const frameId = useRef();

  const handleFinish = (winnerObj) => {
    setIsRacing(false);
    setWinner(winnerObj.name);
    setHorses(prev => prev.map(h => h.id === winnerObj.id ? { ...h, wins: h.wins + 1 } : h));
  };

  const raceLoop = useCallback(() => {
    setHorses(prev => {
      let raceDone = false;
      const next = prev.map(h => {
        if (h.pos >= 84 || raceDone) return h;
        
        // Physics: Variable Speed + Stamina Retention
        const fatigue = (h.pos / 100) * (1 - h.stamina);
        const velocity = 0.45 + (Math.random() * 0.45) - (fatigue * 0.2);
        const newPos = h.pos + velocity;

        if (newPos >= 84) {
          raceDone = true;
          handleFinish(h);
        }
        return { ...h, pos: newPos, v: velocity };
      });
      return next;
    });
    if (isRacing) frameId.current = requestAnimationFrame(raceLoop);
  }, [isRacing]);

  useEffect(() => {
    if (isRacing) frameId.current = requestAnimationFrame(raceLoop);
    return () => cancelAnimationFrame(frameId.current);
  }, [isRacing, raceLoop]);

  const startRace = () => {
    setHorses(prev => prev.map(h => ({ ...h, pos: 0, v: 0 })));
    setWinner(null);
    setIsRacing(true);
  };

  return (
    <>
      <GlobalStyle />
      <Stage>
        <h1 style={{ color: '#f59e0b', fontSize: '3rem', margin: 0, letterSpacing: '2px' }}>PRO DERBY SIM</h1>
        <p style={{ color: '#475569', marginBottom: '40px' }}>Advanced Skeletal Motion Engine v2.0</p>

        <TrackBoard>
          <FinishLine />
          {horses.map(h => (
            <Lane key={h.id}>
              <HorseEntity progress={h.pos}>
                <MuscularBody color={h.color} active={isRacing && !winner} v={h.v || 0.5}>
                  <AnatomicalHead color={h.color} />
                  
                  {/* Front Legs - Leading Gait */}
                  <LegSegment front color={h.color} active={isRacing && !winner} v={h.v || 0.5} delay="0" style={{ left: '48px' }} />
                  <LegSegment front color={h.color} active={isRacing && !winner} v={h.v || 0.5} delay="-0.08" style={{ left: '42px' }} />
                  
                  {/* Back Legs - Pushing Gait */}
                  <LegSegment color={h.color} active={isRacing && !winner} v={h.v || 0.5} delay="-0.22" style={{ left: '15px' }} />
                  <LegSegment color={h.color} active={isRacing && !winner} v={h.v || 0.5} delay="-0.30" style={{ left: '8px' }} />
                </MuscularBody>
                
                <div style={{ position: 'absolute', bottom: '-28px', width: '100%', textAlign: 'center', fontSize: '11px', fontWeight: 'bold', color: '#94a3b8' }}>
                  {h.name}
                </div>
              </HorseEntity>
            </Lane>
          ))}
        </TrackBoard>

        <UIControls>
          {winner && <h2 style={{ color: '#f59e0b', margin: 0 }}>🏆 {winner} Claims the Championship!</h2>}
          <BigButton onClick={startRace} disabled={isRacing}>
            {winner ? 'Enter Next Derby' : 'Release the Gate'}
          </BigButton>
          
          <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
            {horses.map(h => (
              <div key={h.id} style={{ background: '#0f172a', padding: '10px 20px', borderRadius: '10px', border: `1px solid ${h.color}44`, textAlign: 'center' }}>
                <div style={{ color: h.color, fontSize: '10px', fontWeight: 'bold' }}>{h.name}</div>
                <div style={{ fontSize: '1.2rem', fontWeight: '900' }}>{h.wins} W</div>
              </div>
            ))}
          </div>
        </UIControls>
      </Stage>
    </>
  );
};

export default App;