import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled, { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body { margin: 0; background: #020617; font-family: 'Inter', sans-serif; overflow: hidden; }

  /* THE BODY LEAP: Simulates the suspension phase where the horse is airborne */
  @keyframes suspensionLeap {
    0%, 100% { transform: translateY(0) rotate(-2deg); }
    30% { transform: translateY(-45px) rotate(8deg); } /* The Leap */
    60% { transform: translateY(-5px) rotate(-1deg); } /* The Impact */
    85% { transform: translateY(8px) rotate(-5deg); }  /* The Compression */
  }

  /* ROTARY LEG CYCLE: Reaches far forward, then snaps back with power */
  @keyframes rotaryGallop {
    0% { transform: rotate(45deg) scaleY(0.7); }    /* Tucked under belly */
    40% { transform: rotate(-60deg) scaleY(1.15); } /* Full extension reach */
    70% { transform: rotate(20deg) scaleY(0.9); }   /* Ground strike / Push */
    100% { transform: rotate(45deg) scaleY(0.7); }
  }

  /* NECK TENSION: Balances the leap */
  @keyframes neckPower {
    0%, 100% { transform: translate(0,0) rotate(0deg); }
    30% { transform: translate(8px, -12px) rotate(-10deg); }
    70% { transform: translate(-3px, 5px) rotate(5deg); }
  }
`;

const Arena = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, #14532d 0%, #064e3b 100%);
  border: 10px solid #1e1b18;
  margin: 15px;
  position: relative;
  overflow: hidden;
  border-radius: 20px;
  box-shadow: inset 0 0 100px rgba(0,0,0,0.4);
`;

const HorseActor = styled.div.attrs(props => ({
  style: { 
    left: `${props.progress}%`, 
    '--stride-duration': `${0.45 / (props.v || 0.8)}s` 
  }
}))`
  position: absolute;
  height: 75%;
  aspect-ratio: 2 / 1;
  transition: left 0.1s linear;
  z-index: 10;

  .horse-body {
    height: 100%;
    animation: ${props => props.run ? 'suspensionLeap var(--stride-duration) infinite ease-in-out' : 'none'};
  }

  .leg-path {
    transform-origin: top center;
    animation: ${props => props.run ? 'rotaryGallop var(--stride-duration) infinite linear' : 'none'};
  }

  .head-neck {
    transform-origin: 155px 55px;
    animation: ${props => props.run ? 'neckPower var(--stride-duration) infinite ease-in-out' : 'none'};
  }
`;

const Horse = ({ horse, isRacing }) => {
  // Scientifically accurate gallop timing offsets
  const gaitDelays = { 
    backLeft: '-0.3s', 
    backRight: '-0.42s', 
    frontLeft: '-0.05s', 
    frontRight: '-0.15s' 
  };

  return (
    <HorseActor progress={horse.pos} v={horse.v} run={isRacing}>
      <svg viewBox="0 0 300 160" className="horse-body">
        <defs>
          <linearGradient id={`coat-${horse.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={horse.color} />
            <stop offset="100%" stopColor="#000" stopOpacity="0.6" />
          </linearGradient>
        </defs>

        {/* Back Legs (Far side) */}
        <path className="leg-path" d="M85,85 L70,145" stroke={horse.color} strokeWidth="6" strokeLinecap="round" opacity="0.5" style={{ animationDelay: gaitDelays.backLeft }} />
        <path className="leg-path" d="M105,85 L115,145" stroke={horse.color} strokeWidth="6" strokeLinecap="round" opacity="0.5" style={{ animationDelay: gaitDelays.backRight }} />

        {/* Powerful Torso */}
        <path 
          d="M60,85 C40,70 30,40 55,30 C90,15 150,35 180,50 C220,65 230,95 210,120 C185,140 85,135 60,85 Z" 
          fill={`url(#coat-${horse.id})`} 
        />

        {/* Head/Neck with Muscle Definition */}
        <g className="head-neck">
          <path d="M180,50 Q210,10 240,15 L255,50 Q230,85 195,95 Z" fill={horse.color} />
          <path d="M240,15 Q275,15 285,40 L260,75 Q240,75 230,50 Z" fill={horse.color} />
          <circle cx="260" cy="35" r="2.5" fill="white" />
        </g>

        {/* Front Legs (Near side) */}
        <path className="leg-path" d="M175,90 L185,150" stroke={horse.color} strokeWidth="10" strokeLinecap="round" style={{ animationDelay: gaitDelays.frontLeft }} />
        <path className="leg-path" d="M200,90 L180,150" stroke={horse.color} strokeWidth="10" strokeLinecap="round" style={{ animationDelay: gaitDelays.frontRight }} />
        
        {/* Tail */}
        <path d="M58,80 Q20,50 15,130" fill="none" stroke="#111" strokeWidth="4" strokeLinecap="round" opacity="0.7" />
      </svg>
    </HorseActor>
  );
};

// --- App Logic ---

const HORSES = [
  { id: 1, name: "VANGUARD", color: "#78350f" },
  { id: 2, name: "STORM", color: "#475569" },
  { id: 3, name: "EMBER", color: "#b91c1c" },
  { id: 4, name: "ONYX", color: "#09090b" },
];

const App = () => {
  const [horses, setHorses] = useState(HORSES.map(h => ({ ...h, pos: 0, v: 0 })));
  const [racing, setRacing] = useState(false);
  const [winner, setWinner] = useState(null);
  const raf = useRef();

  const loop = useCallback(() => {
    setHorses(prev => {
      let over = false;
      const next = prev.map(h => {
        if (h.pos >= 86) { over = true; return h; }
        const step = 0.5 + Math.random() * 0.6;
        return { ...h, pos: h.pos + step, v: step };
      });
      if (over) {
        setWinner([...next].sort((a,b) => b.pos - a.pos)[0].name);
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
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <GlobalStyle />
      <h1 style={{ textAlign: 'center', color: '#fbbf24', letterSpacing: '12px', margin: '15px' }}>
        {winner ? `${winner} VICTORIOUS` : "CHAMPIONSHIP TURF"}
      </h1>
      <Arena>
        {/* Finish Line Overlay */}
        <div style={{ position: 'absolute', right: '11%', top: 0, bottom: 0, width: '25px', background: 'repeating-linear-gradient(45deg, #fff, #fff 10px, #000 10px, #000 20px)', zIndex: 5, borderLeft: '3px solid #fbbf24' }} />
        
        {horses.map(h => (
          <div key={h.id} style={{ flex: 1, borderBottom: '1px solid rgba(255,255,255,0.05)', position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Horse horse={h} isRacing={racing} />
          </div>
        ))}
      </Arena>
      <button 
        onClick={() => { setHorses(h => h.map(i => ({...i, pos: 0}))); setWinner(null); setRacing(true); }}
        style={{ margin: '20px auto', padding: '15px 60px', background: '#fbbf24', border: 'none', borderRadius: '12px', fontWeight: '900', cursor: 'pointer', fontSize: '1.2rem', boxShadow: '0 8px 0 #b45309' }}
      >
        {racing ? 'RACING...' : 'UNLEASH'}
      </button>
    </div>
  );
};

export default App;