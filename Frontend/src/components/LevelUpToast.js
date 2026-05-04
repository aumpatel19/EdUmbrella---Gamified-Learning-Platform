import React, { useEffect, useState } from 'react';
import { getLevelTitle } from '../lib/gamification';

const LevelUpToast = ({ level, onDone }) => {
  const [visible, setVisible] = useState(true);
  const [fillWidth, setFillWidth] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setFillWidth(100), 100);
    const t2 = setTimeout(() => setVisible(false), 3500);
    const t3 = setTimeout(onDone, 3800);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onDone]);

  return (
    <div style={{
      position: 'fixed', bottom: 80, left: '50%', transform: `translate(-50%, ${visible ? 0 : 80}px)`,
      zIndex: 9998, transition: 'transform 0.4s cubic-bezier(0.175,0.885,0.32,1.275), opacity 0.3s',
      opacity: visible ? 1 : 0, pointerEvents: 'none',
      minWidth: 280,
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #0F1629, #1A2140)',
        border: '1px solid rgba(124,58,237,0.5)',
        borderRadius: 16, padding: '16px 20px',
        boxShadow: '0 0 32px rgba(124,58,237,0.4), 0 8px 24px rgba(0,0,0,0.4)',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: 28, marginBottom: 4 }}>⬆️</div>
        <div style={{ fontSize: 18, fontWeight: 800, color: '#fff', fontFamily: "'Sora', sans-serif" }}>
          Level Up! You're Level {level}
        </div>
        <div style={{ fontSize: 12, color: '#a78bfa', marginBottom: 12 }}>
          {getLevelTitle(level)}
        </div>
        <div style={{ height: 6, background: 'rgba(30,41,59,0.8)', borderRadius: 3, overflow: 'hidden' }}>
          <div style={{
            height: '100%', width: `${fillWidth}%`,
            background: 'linear-gradient(90deg,#7C3AED,#06B6D4)',
            transition: 'width 1.5s ease-out',
          }} />
        </div>
      </div>
    </div>
  );
};

export default LevelUpToast;
