import React, { createContext, useContext, useState, useCallback } from 'react';
import BadgeUnlockModal from '../components/BadgeUnlockModal';
import LevelUpToast from '../components/LevelUpToast';
import { levelFromXP } from '../lib/gamification';

const GamificationContext = createContext(null);

export const GamificationProvider = ({ children }) => {
  const [xp, setXp] = useState(() => parseInt(localStorage.getItem('userXP') || '0'));
  const [streak, setStreak] = useState(() => parseInt(localStorage.getItem('userStreak') || '0'));
  const [level, setLevel] = useState(() => levelFromXP(parseInt(localStorage.getItem('userXP') || '0')));
  const [unlockedBadge, setUnlockedBadge] = useState(null);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [newLevel, setNewLevel] = useState(null);

  const addXP = useCallback((amount, newBadges = [], updatedXP = null) => {
    const prevXP = xp;
    const nextXP = updatedXP !== null ? updatedXP : prevXP + amount;
    const prevLevel = levelFromXP(prevXP);
    const nextLevel = levelFromXP(nextXP);

    setXp(nextXP);
    localStorage.setItem('userXP', String(nextXP));

    if (nextLevel > prevLevel) {
      setLevel(nextLevel);
      setNewLevel(nextLevel);
      setShowLevelUp(true);
    }

    if (newBadges.length > 0) {
      setUnlockedBadge(newBadges[0]);
    }
  }, [xp]);

  const updateStreak = useCallback((newStreak) => {
    setStreak(newStreak);
    localStorage.setItem('userStreak', String(newStreak));
  }, []);

  return (
    <GamificationContext.Provider value={{ xp, streak, level, addXP, updateStreak }}>
      {children}
      {unlockedBadge && (
        <BadgeUnlockModal
          badge={unlockedBadge}
          xpAwarded={unlockedBadge.xp_reward || 0}
          onClose={() => setUnlockedBadge(null)}
        />
      )}
      {showLevelUp && newLevel && (
        <LevelUpToast level={newLevel} onDone={() => setShowLevelUp(false)} />
      )}
    </GamificationContext.Provider>
  );
};

export const useGamification = () => {
  const ctx = useContext(GamificationContext);
  if (!ctx) throw new Error('useGamification must be used within GamificationProvider');
  return ctx;
};
