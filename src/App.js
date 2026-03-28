import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled, { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body { margin: 0; background: #020617; font-family: 'Inter', sans-serif; overflow: hidden; }

  /* 1. THE KINETIC LEAP: Stretches the horse during flight, compresses on impact */
  @keyframes kineticGallop {
    0%, 100% { transform: translateY(0) rotate(-3deg) scaleX(1); }
    35% { transform: translateY(-140px) rotate(4deg) scaleX(1.2); } /* MAXIMUM FLIGHT & STRETCH */
    75% { transform: translateY(25px) rotate(8deg) scaleX(0.85); }   /* IMPACT COMPRESSION */
  }

  /* 2. BALLISTIC SECONDARY MOTION: Mane and Tail Drag */
  @keyframes aeroTail {
    0%, 100% { transform: rotate(15deg); }
    50% { transform: rotate(-45deg); }
  }
`;

const Arena = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #0f172a;
`;

const Track = styled.div`
  flex: 1;
  background: linear-gradient(180deg, #064e3b 0%, #065f46 100%);
  border-top: 40px solid #1e293b;
  border-bottom: 40px solid #1e293b;
  position: relative;
  overflow: hidden;
  box-shadow: inset 0 0 300px rgba(0,0,0,0.6);
`;

const Lane = styled.div`
  height: 25%;
  border-bottom: 1px solid rgba(255,255,255,0.03);
  position: relative;
  display: flex;
  align-items: center;
`;

const HorseActor = styled.div.attrs(props => ({
  style: { 
    left: `${props.pos}%`,
    /* The "Snap" effect: faster transition during the flight phase */
    transition: `left ${props.racing ? '0.08s' : '0.5s'} cubic-bezier(0.1, 1, 0.2, 1)` 
  }
}))`
  position: absolute;
  height: 95%;
  aspect-ratio: 3.5 / 1;
  z-index: 5;

  .phys-root {
    height: 100%;
    animation: ${props => props.racing ? 'kineticGallop 0.4s infinite ease-in-out' : 'none'};
  }
`;

const AnatomicalLeg = ({ x, y, delay, isFront, color }) => (
  <g style={{ transformOrigin: `${x}px ${y}px`, animation: `femurDrive 0.4s infinite linear`, animationDelay: delay }}>
    {/* Femur / Humerus (Upper Bone) */}
    <line x1={x} y1={y} x2={x} y2={y + 70} stroke={color} strokeWidth="22" strokeLinecap="round" />
    {/* Tibia / Radius (Middle Bone) */}
    <g style={{ transformOrigin: `${x}px ${y + 70}px`, animation: `jointSnap 0.4s infinite linear`, animationDelay: delay }}>
      <line x1={x} y1={y + 70} x2={x + (isFront ? 45 : -45)} y2={y + 130} stroke={color} strokeWidth="18" strokeLinecap="round" />
      {/* Fetlock / Hoof */}
      <path d={`M${x + (isFront ? 40 : -70)},${y + 130} h35 v18 h-35 z`} fill="#000" />
    </g>
    <style>{`
      @keyframes femurDrive {
        0%, 100% { transform: rotate(${isFront ? '60deg' : '-55deg'}); }
        45% { transform: rotate(${isFront ? '-80deg' : '75deg'}); } /* The POWER stroke */
      }
      @keyframes jointSnap {
        0%, 100% { transform: rotate(0deg); }
        25% { transform: rotate(${isFront ? '105deg' : '-120deg'}); } /* Extreme Tucking */
        65% { transform: rotate(-20deg); } /* Bracing for impact */
      }
    `}</style>
  </g>
);

const Horse = ({ color, pos, racing }) => (
  <HorseActor pos={pos} racing={racing}>
    <svg viewBox="0 0 550 400" className="phys-root">
      {/* Back Legs (Far side - Atmospheric Depth) */}
      <g opacity="0.3" transform="translate(-20, -15)">
        <AnatomicalLeg x={120} y={150} delay="-0.2s" color={color} />
        <AnatomicalLeg x={350} y={160} delay="-0.38s" isFront color={color} />
      </g>

      {/* Tail (Kinetic physics) */}
      <path d="M100,140 Q30,110 10,230" fill="none" stroke={color} strokeWidth="18" strokeLinecap="round" 
            style={{ transformOrigin: '100px 140px', animation: racing ? 'aeroTail 0.4s infinite' : 'none' }} />

      {/* High-Performance Barrel (Torso) */}
      <path d="M100,145 C60,70 220,60 400,110 C440,130 420,200 370,205 C260,220 110,195 100,145 Z" fill={color} />

      {/* Neck & Head Counter-Balance */}
      <g style={{ transformOrigin: '350px 130px', animation: racing ? 'aeroTail 0.4s infinite reverse' : 'none' }}>
        <path d="M350,130 Q400,40 440,60 L480,120 Q420,165 360,175 Z" fill={color} />
        <path d="M375,65 Q355,85 365,145" fill="none" stroke="#111" strokeWidth="8" strokeLinecap="round" />
        <circle cx="450" cy="95" r="5" fill="white" />
      </g>

      {/* Front Legs (Near side - Full Saturation) */}
      <AnatomicalLeg x={160} y={150} delay="0s" color={color} />
      <AnatomicalLeg x={390} y={160} delay="-0.12s" isFront color={color} />
    </svg>
  </HorseActor>
);

const App = () => {
  const [horses, setHorses] = useState([
    { id: 1, name: "THOROUGHBRED", color: "#451a03", pos: 0 },
    { id: 2, name: "APPALOOSA", color: "#94a3b8", pos: 0 },
    { id: 3, name: "STALLION", color: "#78350f", pos: 0 },
    { id: 4, name: "ONYX", color: "#0f172a", pos: 0 },
  ]);
  const [racing, setRacing] = useState(false);
  const raf = useRef();

  const loop = useCallback(() => {
    setHorses(prev => {
        let fin = false;
        const next = prev.map(h => {
            if (h.pos >= 86) fin = true;
            // Variable "Surge" force - faster during suspension
            const force = Math.random() * 1.8 + 0.4;
            return { ...h, pos: h.pos + force };
        });
        if (fin) setRacing(false);
        return next;
    });
    if (racing) raf.current = requestAnimationFrame(loop);
  }, [racing]);

  useEffect(() => {
    if (racing) raf.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf.current);
  }, [racing, loop]);

  return (
    <Arena>
      <div style={{ padding: '30px', textAlign: 'center', background: '#020617', borderBottom: '4px solid #1e293b' }}>
        <h1 style={{ color: '#fbbf24', letterSpacing: '15px', fontSize: '3rem', margin: 0, fontWeight: 900 }}>EQUINE KINETICS v48.0</h1>
        <button 
          onClick={() => { setHorses(h => h.map(i => ({...i, pos: 0}))); setRacing(true); }}
          style={{ 
            marginTop: '20px', padding: '15px 80px', background: '#fbbf24', 
            border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 950, fontSize: '1.2rem' 
          }}
        >
          {racing ? 'OBSERVING GAIT...' : 'INITIATE SIMULATION'}
        </button>
      </div>

      <Track>
        <div style={{ position: 'absolute', right: '11%', top: 0, bottom: 0, width: '4px', background: 'white', opacity: 0.3, zIndex: 10 }} />
        {horses.map(h => (
          <Lane key={h.id}>
             <Horse color={h.color} pos={h.pos} racing={racing} />
          </Lane>
        ))}
      </Track>
    </Arena>
  );
};

export default App;