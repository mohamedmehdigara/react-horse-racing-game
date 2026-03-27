import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled, { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body { margin: 0; background: #010409; font-family: 'Montserrat', sans-serif; overflow: hidden; color: white; }
  
  @keyframes apexSpine {
    0%, 100% { transform: translateY(0) scaleX(1) rotate(0deg); }
    30% { transform: translateY(-130px) scaleX(1.6) rotate(32deg); }
    65% { transform: translateY(-40px) scaleX(0.45) rotate(-20deg); }
    85% { transform: translateY(60px) scaleX(0.4) rotate(-35deg); }
  }

  @keyframes turfBlast {
    0%, 60% { opacity: 0; transform: scale(0); }
    65% { opacity: 0.8; transform: scale(3) translate(-40px, -30px); }
    100% { opacity: 0; transform: scale(12) translate(-200px, -180px); }
  }
`;

const MainContainer = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, #0f172a 0%, #020617 100%);
`;

const HUD = styled.div`
  padding: 40px;
  text-align: center;
  background: rgba(0,0,0,0.5);
  border-bottom: 4px solid #fbbf24;
`;

const Track = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 20px;
  position: relative;
  overflow: hidden;
`;

const Lane = styled.div`
  flex: 1;
  position: relative;
  border-bottom: 2px dashed rgba(255,255,255,0.1);
  display: flex;
  align-items: center;
  background: ${props => props.isWinner ? 'rgba(251, 191, 36, 0.1)' : 'transparent'};
  transition: background 0.5s;

  &::before {
    content: "${props => props.laneNum}";
    position: absolute;
    left: 20px;
    font-size: 8rem;
    font-weight: 900;
    opacity: 0.1;
    font-style: italic;
  }
`;

const FinishWall = styled.div`
  position: absolute;
  right: 12%;
  top: 0;
  bottom: 0;
  width: 20px;
  background: #fbbf24;
  box-shadow: 0 0 50px #fbbf24;
  z-index: 20;
  
  &::after {
    content: "FINISH";
    position: absolute;
    top: -40px;
    left: -50px;
    color: #fbbf24;
    font-weight: 900;
    letter-spacing: 10px;
  }
`;

const HorseActor = styled.div.attrs(props => ({
  style: { left: `${props.progress}%`, '--stride': `${0.15 / (props.v || 1)}s` }
}))`
  position: absolute;
  height: 90%;
  aspect-ratio: 4 / 1;
  transition: left 0.1s cubic-bezier(0.1, 1, 0.2, 1);
  z-index: 15;

  .skeleton {
    height: 100%;
    animation: ${props => props.run ? 'apexSpine var(--stride) infinite ease-in-out' : 'none'};
  }
`;

const ArchitectLeg = ({ x, y, color, delay, opacity = 1, isFront = false }) => (
  <g style={{ transformOrigin: `${x}px ${y}px`, animation: `thrust 0.15s infinite linear`, animationDelay: delay }}>
    <line x1={x} y1={y} x2={x} y2={y + 80} stroke={color} strokeWidth={isFront ? 28 : 20} strokeLinecap="round" opacity={opacity} />
    <style>{`
      @keyframes thrust { 0% { transform: rotate(120deg); } 40% { transform: rotate(-140deg); } 100% { transform: rotate(120deg); } }
    `}</style>
  </g>
);

const App = () => {
  const [horses, setHorses] = useState([
    { id: 1, name: "STORM", color: "#f8fafc", pos: 0, v: 0 },
    { id: 2, name: "BLAZE", color: "#ef4444", pos: 0, v: 0 },
    { id: 3, name: "MIDNIGHT", color: "#6366f1", pos: 0, v: 0 },
    { id: 4, name: "GOLDEN", color: "#fbbf24", pos: 0, v: 0 },
  ]);
  const [racing, setRacing] = useState(false);
  const [winner, setWinner] = useState(null);
  const raf = useRef();

  const loop = useCallback(() => {
    setHorses(prev => {
      let winnerFound = null;
      const next = prev.map(h => {
        if (h.pos >= 82) { winnerFound = h.name; return h; }
        const speed = 1.2 + Math.random() * 2.0;
        return { ...h, pos: h.pos + speed, v: speed };
      });
      if (winnerFound) {
        setWinner(winnerFound);
        setRacing(false);
      }
      return next;
    });
    if (racing) raf.current = requestAnimationFrame(loop);
  }, [racing]);

  useEffect(() => {
    if (racing) raf.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf.current);
  }, [racing, loop]);

  return (
    <MainContainer>
      <GlobalStyle />
      <HUD>
        <h1 style={{ fontSize: '6rem', margin: 0, letterSpacing: '20px' }}>
            {winner ? `${winner} WINS!` : "PLACE YOUR BETS"}
        </h1>
        {racing && <p style={{ fontSize: '2rem', color: '#fbbf24' }}>RACE IN PROGRESS...</p>}
      </HUD>

      <Track>
        <FinishWall />
        {horses.map((h, i) => (
          <Lane key={h.id} laneNum={i + 1} isWinner={winner === h.name}>
            <HorseActor progress={h.pos} v={h.v} run={racing}>
                <svg viewBox="0 0 600 400" className="skeleton">
                    <ArchitectLeg x={200} y={200} color={h.color} delay="-0.05s" opacity={0.2} />
                    <path d="M150,220 C100,200 100,120 400,180 C500,220 450,350 150,220 Z" fill={h.color} />
                    <circle cx={480} cy={160} r="15" fill="white" />
                    <ArchitectLeg x={250} y={220} color={h.color} delay="0s" isFront />
                </svg>
            </HorseActor>
          </Lane>
        ))}
      </Track>

      <div style={{ padding: '40px', textAlign: 'center' }}>
        <button 
          onClick={() => { setHorses(h => h.map(i => ({...i, pos: 0}))); setWinner(null); setRacing(true); }}
          style={{ 
            padding: '40px 100px', fontSize: '4rem', background: '#fbbf24', 
            borderRadius: '20px', border: 'none', fontWeight: 'bold', cursor: 'pointer',
            boxShadow: '0 15px 0 #92400e'
          }}
        >
          {racing ? 'RACING...' : 'START RACE'}
        </button>
      </div>
    </MainContainer>
  );
};

export default App;