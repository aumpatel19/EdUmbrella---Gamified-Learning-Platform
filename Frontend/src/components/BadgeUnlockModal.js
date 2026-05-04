import React, { useEffect, useState } from 'react';
import Badge from './Badge';
import { TIER_COLORS } from '../lib/gamification';

const BadgeUnlockModal = ({ badge, xpAwarded = 0, onClose }) => {
  const [show, setShow] = useState(false);
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (!badge) return;
    setShow(true);
    const p = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      color: ['#FFD700', '#FF6EFF', '#06B6D4', '#10B981', '#a78bfa'][Math.floor(Math.random() * 5)],
      size: Math.random() * 8 + 4,
      delay: Math.random() * 0.5,
    }));
    setParticles(p);
  }, [badge]);

  if (!badge) return null;
  const tc = TIER_COLORS[badge.tier] || TIER_COLORS.Gold;

  const handleClose = () => {
    setShow(false);
    setTimeout(onClose, 300);
  };

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(0,0,0,0.85)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 20,
        opacity: show ? 1 : 0, transition: 'opacity 0.3s',
      }}
      onClick={handleClose}
    >
      {/* Confetti */}
      {particles.map(p => (
        <div key={p.id} style={{
          position: 'absolute', left: `${p.x}%`, top: `${p.y}%`,
          width: p.size, height: p.size, borderRadius: '50%',
          background: p.color, opacity: 0.8,
          animation: `fall 2s ease-in ${p.delay}s forwards`,
          pointerEvents: 'none',
        }} />
      ))}

      <div
        style={{
          background: '#0F1629',
          border: `2px solid ${tc.from}60`,
          borderRadius: 24,
          padding: '40px 32px',
          maxWidth: 360,
          width: '100%',
          textAlign: 'center',
          boxShadow: `0 0 60px ${tc.glow}, 0 0 120px ${tc.glow}40`,
          transform: show ? 'scale(1) translateY(0)' : 'scale(0.8) translateY(20px)',
          transition: 'transform 0.4s cubic-bezier(0.175,0.885,0.32,1.275)',
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ fontSize: 13, color: '#94a3b8', marginBottom: 16, letterSpacing: 2, textTransform: 'uppercase' }}>
          🎉 Achievement Unlocked!
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
          <Badge
            tier={badge.tier}
            name={badge.name}
            icon={badge.icon}
            rarity={badge.rarity}
            size="xl"
          />
        </div>

        <h2 style={{ fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 8, fontFamily: "'Sora', sans-serif" }}>
          {badge.name}
        </h2>
        <p style={{ fontSize: 14, color: '#94a3b8', marginBottom: 20, lineHeight: 1.5 }}>
          {badge.description}
        </p>

        {xpAwarded > 0 && (
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '8px 20px', borderRadius: 50,
            background: 'linear-gradient(135deg, rgba(124,58,237,0.25), rgba(6,182,212,0.25))',
            border: '1px solid rgba(124,58,237,0.4)',
            color: '#a78bfa', fontWeight: 700, fontSize: 16, marginBottom: 24,
          }}>
            ⚡ +{xpAwarded} XP
          </div>
        )}

        <button
          onClick={handleClose}
          style={{
            width: '100%', padding: '12px 0',
            borderRadius: 12, border: 'none', cursor: 'pointer',
            background: `linear-gradient(135deg, ${tc.from}, ${tc.to})`,
            color: '#fff', fontWeight: 700, fontSize: 15,
          }}
        >
          Awesome! 🚀
        </button>
      </div>

      <style>{`
        @keyframes fall {
          0% { transform: translateY(-20px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default BadgeUnlockModal;
