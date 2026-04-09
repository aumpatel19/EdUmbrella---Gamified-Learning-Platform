/**
 * EdUmbrella brand logo — SVG umbrella icon.
 * The umbrella canopy represents "coverage / protection of education",
 * split into 3 sections to suggest subjects / breadth of learning.
 * Gradient: purple (#7C3AED) → indigo → cyan (#06B6D4), matching the app theme.
 *
 * Usage:
 *   <EdUmbrellaLogo size={36} />          — icon only
 *   <EdUmbrellaLogo size={36} withText /> — icon + wordmark
 */

const EdUmbrellaLogo = ({ size = 40, withText = false, textColor = '#fff', portal }) => {
  const icon = (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="EdUmbrella logo"
    >
      <defs>
        <linearGradient id="eu-bg" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#7C3AED" />
          <stop offset="55%" stopColor="#4F46E5" />
          <stop offset="100%" stopColor="#06B6D4" />
        </linearGradient>
        <linearGradient id="eu-rib" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#5B21B6" />
          <stop offset="100%" stopColor="#0891B2" />
        </linearGradient>
      </defs>

      {/* App-icon background */}
      <rect width="40" height="40" rx="9" fill="url(#eu-bg)" />

      {/* ── Umbrella canopy (filled white dome) ── */}
      {/* Half-ellipse: left (5,22) → peak (20,9) → right (35,22), closed */}
      <path
        d="M 5 22 A 15 13 0 0 1 35 22 Z"
        fill="white"
        fillOpacity="0.96"
      />

      {/* Scallop edge — three small downward bumps at canopy bottom for realism */}
      <path
        d="M 5 22 Q 10 25.5 15 22 Q 20 25.5 25 22 Q 30 25.5 35 22"
        fill="white"
        fillOpacity="0.96"
        stroke="none"
      />

      {/* Rib separators — two subtle dividers inside the canopy */}
      <line x1="20" y1="22" x2="12.5" y2="11.5"
        stroke="url(#eu-rib)" strokeWidth="1.1" strokeOpacity="0.4" />
      <line x1="20" y1="22" x2="27.5" y2="11.5"
        stroke="url(#eu-rib)" strokeWidth="1.1" strokeOpacity="0.4" />

      {/* ── Umbrella handle ── */}
      {/* Straight shaft then J-curve at bottom */}
      <path
        d="M 20 22 L 20 31.5 Q 20 35.5 16 35.5"
        stroke="white"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Tip dot at apex of canopy */}
      <circle cx="20" cy="9" r="1.6" fill="white" fillOpacity="0.9" />
    </svg>
  );

  if (!withText) return icon;

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: Math.round(size * 0.25) }}>
      {icon}
      <div style={{ lineHeight: 1 }}>
        <div style={{
          color: textColor,
          fontWeight: 700,
          fontSize: Math.round(size * 0.38),
          fontFamily: "'Sora', 'Plus Jakarta Sans', sans-serif",
          letterSpacing: '-0.01em',
        }}>
          EdUmbrella
        </div>
        {portal && (
          <div style={{
            color: 'rgba(148,163,184,0.8)',
            fontSize: Math.round(size * 0.25),
            marginTop: 1,
          }}>
            {portal}
          </div>
        )}
      </div>
    </div>
  );
};

export default EdUmbrellaLogo;
