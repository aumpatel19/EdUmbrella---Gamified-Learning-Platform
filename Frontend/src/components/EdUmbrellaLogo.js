/**
 * EdUmbrella brand logo — inline SVG matching the pixel-art style:
 * 3 stars on top, colorful umbrella canopy (green/orange/blue),
 * gamepad icon as the handle body, J-curve hook at bottom.
 * No image file needed — works on any background.
 */

const EdUmbrellaLogo = ({ size = 40, withText = false, portal }) => {
  const icon = (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block", flexShrink: 0 }}
    >
      {/* ── 3 Stars ── */}
      {/* Left star (green) */}
      <polygon points="18,14 19.5,18 23,18 20.2,20.5 21.3,24 18,21.8 14.7,24 15.8,20.5 13,18 16.5,18"
        fill="#4ADE80" />
      {/* Center star (gold) — slightly bigger */}
      <polygon points="40,6 42,12 48,12 43.5,15.5 45.5,21.5 40,18 34.5,21.5 36.5,15.5 32,12 38,12"
        fill="#FBBF24" />
      {/* Right star (blue) */}
      <polygon points="62,14 63.5,18 67,18 64.2,20.5 65.3,24 62,21.8 58.7,24 59.8,20.5 57,18 60.5,18"
        fill="#38BDF8" />

      {/* ── Umbrella canopy ── */}
      {/* Full dome shape */}
      <path d="M12 46 Q12 24 40 22 Q68 24 68 46 Z" fill="#38BDF8" />
      {/* Green left third */}
      <path d="M12 46 Q12 24 40 22 L40 46 Z" fill="#4ADE80" />
      {/* Orange center third */}
      <path d="M26 46 Q26 26 40 22 Q54 26 54 46 Z" fill="#F97316" />
      {/* Scallop bottom edge */}
      <path d="M12 46 Q18 51 24 46 Q30 51 36 46 Q40 51 44 46 Q50 51 56 46 Q62 51 68 46"
        fill="none" stroke="#1E293B" strokeWidth="0.5" />
      <path d="M12 46 Q18 52 24 46" fill="#4ADE80" />
      <path d="M24 46 Q30 52 36 46" fill="#F97316" />
      <path d="M36 46 Q40 52 44 46" fill="#F97316" />
      <path d="M44 46 Q50 52 56 46" fill="#38BDF8" />
      <path d="M56 46 Q62 52 68 46" fill="#38BDF8" />

      {/* Canopy center spike tip */}
      <circle cx="40" cy="22" r="2" fill="#FBBF24" />

      {/* ── Gamepad body ── */}
      <rect x="26" y="49" width="28" height="16" rx="8" fill="#38BDF8" />
      {/* D-pad left side */}
      <rect x="29" y="54" width="5" height="2" rx="1" fill="#1E40AF" />
      <rect x="30.5" y="52.5" width="2" height="5" rx="1" fill="#1E40AF" />
      {/* Buttons right side */}
      <circle cx="51" cy="54" r="1.5" fill="#FBBF24" />
      <circle cx="54" cy="57" r="1.5" fill="#4ADE80" />
      <circle cx="48" cy="57" r="1.5" fill="#F87171" />
      <circle cx="51" cy="60" r="1.5" fill="#38BDF8" />
      {/* Center buttons */}
      <rect x="38" y="55.5" width="3" height="2" rx="1" fill="#1E40AF" />
      <rect x="39" y="54.5" width="1" height="4" rx="0.5" fill="#1E40AF" />

      {/* ── J-handle ── */}
      <path d="M40 65 L40 72 Q40 78 33 78"
        stroke="#38BDF8" strokeWidth="3.5" strokeLinecap="round" fill="none" />
    </svg>
  );

  if (!withText) return icon;

  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: Math.round(size * 0.28) }}>
      {icon}
      <div style={{ lineHeight: 1 }}>
        <div style={{
          color: "#fff",
          fontWeight: 700,
          fontSize: Math.round(size * 0.38),
          fontFamily: "'Sora', 'Plus Jakarta Sans', sans-serif",
          letterSpacing: "-0.01em",
        }}>
          EdUmbrella
        </div>
        {portal && (
          <div style={{
            color: "rgba(148,163,184,0.8)",
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
