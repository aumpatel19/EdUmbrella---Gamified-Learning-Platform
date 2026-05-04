import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import IntegerBattle from './integer-battle';

const IntegerBattleGame = () => {
  const navigate = useNavigate();
  return (
    <div style={{ minHeight: '100vh', background: '#080D1A', color: '#fff' }}>
      <div style={{ background: 'rgba(8,13,26,0.95)', borderBottom: '1px solid rgba(124,58,237,0.2)', padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 12, position: 'sticky', top: 0, zIndex: 50 }}>
        <button onClick={() => navigate('/games')} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 8, border: '1px solid rgba(99,102,241,0.25)', background: 'rgba(15,22,41,0.6)', color: '#94a3b8', cursor: 'pointer', fontSize: 13 }}>
          <ArrowLeft size={14} /> Back
        </button>
        <span style={{ fontWeight: 700, fontSize: 16 }}>⚔️ Integer Battle</span>
        <span style={{ fontSize: 12, padding: '3px 10px', borderRadius: 20, background: 'rgba(124,58,237,0.18)', border: '1px solid rgba(124,58,237,0.3)', color: '#a78bfa' }}>Class 7 · Math</span>
      </div>
      <div style={{ maxWidth: 600, margin: '0 auto', paddingTop: 24 }}>
        <IntegerBattle />
      </div>
    </div>
  );
};

export default IntegerBattleGame;
