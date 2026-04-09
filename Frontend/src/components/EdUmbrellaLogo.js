import logo from "../assets/edumbrella-logo.png";

/**
 * EdUmbrella brand logo using the official pixel-art logo image.
 *
 * Usage:
 *   <EdUmbrellaLogo size={36} />          — icon only
 *   <EdUmbrellaLogo size={36} withText /> — icon + wordmark
 */
const EdUmbrellaLogo = ({ size = 40, withText = false, portal }) => {
  // Show only the top ~60% of the image (umbrella + gamepad icon, no text)
  const icon = (
    <div style={{
      width: size,
      height: size,
      overflow: "hidden",
      flexShrink: 0,
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "center",
    }}>
      <img
        src={logo}
        alt="EdUmbrella"
        style={{
          width: size * 1.6,
          height: "auto",
          objectFit: "contain",
          display: "block",
          marginLeft: -(size * 0.3),
        }}
      />
    </div>
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
