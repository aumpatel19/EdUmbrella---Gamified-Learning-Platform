// SVG subject logo icons — used everywhere subject icons appear

const icons = {
  Mathematics: ({ size = 40 }) => (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <rect width="40" height="40" rx="10" fill="url(#math-bg)" />
      <text x="20" y="27" textAnchor="middle" fontSize="20" fontWeight="bold" fontFamily="serif" fill="white">∑</text>
      <defs>
        <linearGradient id="math-bg" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3B82F6" />
          <stop offset="1" stopColor="#1D4ED8" />
        </linearGradient>
      </defs>
    </svg>
  ),

  Science: ({ size = 40 }) => (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <rect width="40" height="40" rx="10" fill="url(#sci-bg)" />
      {/* Atom nucleus */}
      <circle cx="20" cy="20" r="3" fill="white" />
      {/* Orbits */}
      <ellipse cx="20" cy="20" rx="12" ry="5" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" fill="none" />
      <ellipse cx="20" cy="20" rx="12" ry="5" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" fill="none" transform="rotate(60 20 20)" />
      <ellipse cx="20" cy="20" rx="12" ry="5" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" fill="none" transform="rotate(120 20 20)" />
      <defs>
        <linearGradient id="sci-bg" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#10B981" />
          <stop offset="1" stopColor="#065F46" />
        </linearGradient>
      </defs>
    </svg>
  ),

  Physics: ({ size = 40 }) => (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <rect width="40" height="40" rx="10" fill="url(#phy-bg)" />
      {/* Lightning bolt */}
      <path d="M23 8L14 22h8l-5 10 13-16h-8l5-8z" fill="white" />
      <defs>
        <linearGradient id="phy-bg" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#7C3AED" />
          <stop offset="1" stopColor="#4C1D95" />
        </linearGradient>
      </defs>
    </svg>
  ),

  Chemistry: ({ size = 40 }) => (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <rect width="40" height="40" rx="10" fill="url(#chem-bg)" />
      {/* Flask */}
      <path d="M16 10h8v8l6 12H10l6-12V10z" stroke="white" strokeWidth="1.8" fill="none" strokeLinejoin="round" />
      <path d="M12 27c1-2 4-3 8-3s7 1 8 3" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" fill="none" />
      <circle cx="18" cy="25" r="1.5" fill="rgba(255,255,255,0.8)" />
      <circle cx="23" cy="27" r="1" fill="rgba(255,255,255,0.6)" />
      <defs>
        <linearGradient id="chem-bg" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F59E0B" />
          <stop offset="1" stopColor="#92400E" />
        </linearGradient>
      </defs>
    </svg>
  ),

  Biology: ({ size = 40 }) => (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <rect width="40" height="40" rx="10" fill="url(#bio-bg)" />
      {/* DNA double helix simplified */}
      <path d="M14 8c4 4 8 4 12 8s-8 4-12 8 8 4 12 8" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M26 8c-4 4-8 4-12 8s8 4 12 8-8 4-12 8" stroke="rgba(255,255,255,0.55)" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Rungs */}
      <line x1="16" y1="14" x2="24" y2="14" stroke="rgba(255,255,255,0.6)" strokeWidth="1.2" />
      <line x1="16" y1="20" x2="24" y2="20" stroke="rgba(255,255,255,0.6)" strokeWidth="1.2" />
      <line x1="16" y1="26" x2="24" y2="26" stroke="rgba(255,255,255,0.6)" strokeWidth="1.2" />
      <defs>
        <linearGradient id="bio-bg" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#10B981" />
          <stop offset="1" stopColor="#064E3B" />
        </linearGradient>
      </defs>
    </svg>
  ),

  English: ({ size = 40 }) => (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <rect width="40" height="40" rx="10" fill="url(#eng-bg)" />
      {/* Open book */}
      <path d="M20 12v18" stroke="white" strokeWidth="1.5" />
      <path d="M20 12c-2-2-8-3-11-1v18c3-2 9-1 11 1z" fill="rgba(255,255,255,0.25)" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M20 12c2-2 8-3 11-1v18c-3-2-9-1-11 1z" fill="rgba(255,255,255,0.15)" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
      {/* Lines */}
      <line x1="13" y1="17" x2="18" y2="16.5" stroke="rgba(255,255,255,0.6)" strokeWidth="1" />
      <line x1="13" y1="21" x2="18" y2="20.5" stroke="rgba(255,255,255,0.6)" strokeWidth="1" />
      <line x1="13" y1="25" x2="18" y2="24.5" stroke="rgba(255,255,255,0.6)" strokeWidth="1" />
      <defs>
        <linearGradient id="eng-bg" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#EF4444" />
          <stop offset="1" stopColor="#991B1B" />
        </linearGradient>
      </defs>
    </svg>
  ),

  Hindi: ({ size = 40 }) => (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <rect width="40" height="40" rx="10" fill="url(#hin-bg)" />
      {/* Devanagari-style "ह" simplified */}
      <line x1="10" y1="14" x2="30" y2="14" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <path d="M15 14v10c0 3 2 5 5 5s5-2 5-5v-2" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M25 14v14" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <path d="M20 24c3 0 5 1 5 3" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <defs>
        <linearGradient id="hin-bg" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#EC4899" />
          <stop offset="1" stopColor="#9D174D" />
        </linearGradient>
      </defs>
    </svg>
  ),

  'Social Science': ({ size = 40 }) => (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <rect width="40" height="40" rx="10" fill="url(#soc-bg)" />
      {/* Globe */}
      <circle cx="20" cy="20" r="11" stroke="white" strokeWidth="1.5" fill="none" />
      <ellipse cx="20" cy="20" rx="5" ry="11" stroke="rgba(255,255,255,0.65)" strokeWidth="1.2" fill="none" />
      <line x1="9" y1="20" x2="31" y2="20" stroke="rgba(255,255,255,0.65)" strokeWidth="1.2" />
      <path d="M11 14c3 1 6 1.5 9 1.5s6-.5 9-1.5" stroke="rgba(255,255,255,0.5)" strokeWidth="1" fill="none" />
      <path d="M11 26c3-1 6-1.5 9-1.5s6 .5 9 1.5" stroke="rgba(255,255,255,0.5)" strokeWidth="1" fill="none" />
      <defs>
        <linearGradient id="soc-bg" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F59E0B" />
          <stop offset="1" stopColor="#78350F" />
        </linearGradient>
      </defs>
    </svg>
  ),

  History: ({ size = 40 }) => (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <rect width="40" height="40" rx="10" fill="url(#hist-bg)" />
      {/* Pillar / column */}
      <rect x="14" y="12" width="12" height="2" rx="1" fill="white" />
      <rect x="14" y="26" width="12" height="2" rx="1" fill="white" />
      <rect x="16" y="14" width="2" height="12" fill="rgba(255,255,255,0.8)" />
      <rect x="19" y="14" width="2" height="12" fill="rgba(255,255,255,0.8)" />
      <rect x="22" y="14" width="2" height="12" fill="rgba(255,255,255,0.8)" />
      <rect x="12" y="28" width="16" height="2" rx="1" fill="white" />
      <defs>
        <linearGradient id="hist-bg" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F97316" />
          <stop offset="1" stopColor="#7C2D12" />
        </linearGradient>
      </defs>
    </svg>
  ),

  Geography: ({ size = 40 }) => (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <rect width="40" height="40" rx="10" fill="url(#geo-bg)" />
      {/* Map pin */}
      <path d="M20 9c-4.4 0-8 3.6-8 8 0 6 8 14 8 14s8-8 8-14c0-4.4-3.6-8-8-8z" stroke="white" strokeWidth="1.8" fill="rgba(255,255,255,0.2)" />
      <circle cx="20" cy="17" r="3" fill="white" />
      <defs>
        <linearGradient id="geo-bg" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#06B6D4" />
          <stop offset="1" stopColor="#0E7490" />
        </linearGradient>
      </defs>
    </svg>
  ),
};

const fallbackColors = {
  Mathematics: '#3B82F6', Science: '#10B981', Physics: '#7C3AED',
  Chemistry: '#F59E0B', Biology: '#10B981', English: '#EF4444',
  Hindi: '#EC4899', 'Social Science': '#F59E0B', History: '#F97316', Geography: '#06B6D4',
};

const SubjectIcon = ({ name, size = 40 }) => {
  const Icon = icons[name];
  if (Icon) return <Icon size={size} />;

  // Fallback: colored circle with first letter
  const color = fallbackColors[name] || '#6366F1';
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <rect width="40" height="40" rx="10" fill={color} />
      <text x="20" y="27" textAnchor="middle" fontSize="18" fontWeight="bold" fontFamily="sans-serif" fill="white">
        {(name || '?')[0]}
      </text>
    </svg>
  );
};

export default SubjectIcon;
