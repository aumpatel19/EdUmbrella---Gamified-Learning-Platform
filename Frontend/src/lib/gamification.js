export const XP_RULES = {
  lecture_complete: 10,
  quiz_pass: 50,
  game_complete: 30,
  daily_streak: 5,
};

export const levelFromXP = (xp) => Math.floor(xp / 500) + 1;

export const xpToNextLevel = (xp) => {
  const level = levelFromXP(xp);
  return level * 500 - xp;
};

export const xpProgressInLevel = (xp) => {
  const level = levelFromXP(xp);
  const levelStart = (level - 1) * 500;
  return xp - levelStart;
};

export const TIER_COLORS = {
  Bronze:   { from: '#CD7F32', to: '#A0522D', glow: 'rgba(205,127,50,0.5)',  text: '#CD7F32' },
  Silver:   { from: '#C0C0C0', to: '#808080', glow: 'rgba(192,192,192,0.5)', text: '#C0C0C0' },
  Gold:     { from: '#FFD700', to: '#FFA500', glow: 'rgba(255,215,0,0.5)',   text: '#FFD700' },
  Platinum: { from: '#00CED1', to: '#20B2AA', glow: 'rgba(0,206,209,0.5)',   text: '#00CED1' },
  Diamond:  { from: '#B44FEB', to: '#FF6EFF', glow: 'rgba(180,79,235,0.6)',  text: '#B44FEB' },
};

export const RARITY_COLORS = {
  Common:    '#94a3b8',
  Rare:      '#60a5fa',
  Epic:      '#a78bfa',
  Legendary: '#fbbf24',
};

export const LEVEL_TITLES = [
  'Novice', 'Learner', 'Scholar', 'Adept', 'Expert',
  'Master', 'Grand Master', 'Champion', 'Legend', 'Mythic',
];

export const getLevelTitle = (level) => LEVEL_TITLES[Math.min(level - 1, LEVEL_TITLES.length - 1)];
