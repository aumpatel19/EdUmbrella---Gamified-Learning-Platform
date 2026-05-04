import React from 'react';
import { TIER_COLORS, RARITY_COLORS } from '../lib/gamification';

const Badge = ({ tier = 'Bronze', name, icon = '🏅', locked = false, earnedAt = null, rarity = 'Common', size = 'md', onClick }) => {
  const tc = TIER_COLORS[tier] || TIER_COLORS.Bronze;
  const rc = RARITY_COLORS[rarity] || RARITY_COLORS.Common;

  const sizes = {
    sm:  { outer: 52,  inner: 40,  emoji: 20, font: 10 },
    md:  { outer: 72,  inner: 56,  emoji: 28, font: 11 },
    lg:  { outer: 96,  inner: 76,  emoji: 36, font: 12 },
    xl:  { outer: 120, inner: 96,  emoji: 44, font: 13 },
  };
  const s = sizes[size] || sizes.md;

  const outerStyle = {
    width: s.outer,
    height: s.outer,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    cursor: onClick ? 'pointer' : 'default',
    flexShrink: 0,
    background: locked
      ? 'rgba(30,41,59,0.8)'
      : `radial-gradient(circle at 30% 30%, ${tc.from}, ${tc.to})`,
    boxShadow: locked ? 'none' : `0 0 ${size === 'xl' ? 20 : 12}px ${tc.glow}, 0 0 ${size === 'xl' ? 40 : 20}px ${tc.glow}40`,
    border: locked ? '2px solid rgba(99,102,241,0.2)' : `2px solid ${tc.from}80`,
    transition: 'transform 0.2s, box-shadow 0.2s',
    filter: locked ? 'grayscale(100%)' : 'none',
  };

  const innerStyle = {
    width: s.inner,
    height: s.inner,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: locked ? 'rgba(15,22,41,0.9)' : 'rgba(0,0,0,0.25)',
    fontSize: s.emoji,
    position: 'relative',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      <div
        style={outerStyle}
        onClick={onClick}
        onMouseEnter={e => { if (!locked) { e.currentTarget.style.transform = 'scale(1.12)'; e.currentTarget.style.boxShadow = `0 0 24px ${tc.glow}, 0 0 48px ${tc.glow}`; } }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = locked ? 'none' : `0 0 12px ${tc.glow}, 0 0 20px ${tc.glow}40`; }}
      >
        <div style={innerStyle}>
          {locked ? '🔒' : icon}
        </div>
        {!locked && (
          <div style={{
            position: 'absolute', bottom: -2, right: -2,
            width: s.font + 8, height: s.font + 8,
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${tc.from}, ${tc.to})`,
            border: '1.5px solid rgba(0,0,0,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 8, color: '#fff', fontWeight: 700,
          }}>
            {tier[0]}
          </div>
        )}
      </div>
      {size !== 'sm' && (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: s.font, fontWeight: 600, color: locked ? '#475569' : '#e2e8f0', lineHeight: 1.2, maxWidth: s.outer + 8 }}>{name}</div>
          {size !== 'md' && (
            <div style={{ fontSize: s.font - 1, color: rc, fontWeight: 500 }}>{rarity}</div>
          )}
          {earnedAt && size === 'xl' && (
            <div style={{ fontSize: 10, color: '#64748b' }}>{new Date(earnedAt).toLocaleDateString()}</div>
          )}
        </div>
      )}
    </div>
  );
};

export default Badge;
