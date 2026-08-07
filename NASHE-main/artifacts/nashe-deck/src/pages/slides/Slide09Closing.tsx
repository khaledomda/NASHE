const base = import.meta.env.BASE_URL;

export default function Slide09Closing() {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        fontFamily: "'DM Sans', sans-serif",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        padding: "6vh 8vw",
        boxSizing: "border-box",
        color: "white",
      }}
    >
      {/* Full-bleed stadium background */}
      <img
        src={`${base}stadium-closing.jpg`}
        crossOrigin="anonymous"
        alt="Stadium at golden hour"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0 }}
      />

      {/* Dark gradient overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to right, rgba(10,30,20,0.92) 50%, rgba(10,30,20,0.6) 100%)",
          zIndex: 1,
        }}
      />

      {/* Green glow */}
      <div style={{ position: "absolute", top: "-10vw", right: "-8vw", width: "35vw", height: "35vw", borderRadius: "50%", backgroundColor: "#1B5E3B", opacity: 0.3, filter: "blur(6vw)", zIndex: 1 }} />

      {/* Geometric accents */}
      <div style={{ position: "absolute", bottom: "20vh", left: "8vw", width: "2vw", height: "2vw", borderRadius: "50%", backgroundColor: "#F97316", opacity: 0.9, zIndex: 2 }} />
      <div style={{ position: "absolute", bottom: "27vh", left: "38vw", width: "1.5vw", height: "1.5vw", borderRadius: "0.2vw", backgroundColor: "#1B5E3B", opacity: 0.7, transform: "rotate(45deg)", zIndex: 2 }} />

      {/* Header bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.8vw" }}>
          <div style={{ width: "1.5vw", height: "1.5vw", backgroundColor: "#F97316", borderRadius: "0.3vw" }} />
          <div style={{ fontSize: "1.2vw", fontWeight: 700, color: "white" }}>ناشئ — NASHE</div>
        </div>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5vw", padding: "0.5vh 1vw", backgroundColor: "rgba(255,255,255,0.1)", borderRadius: "2vw" }}>
          <span style={{ fontSize: "0.9vw", fontWeight: 600, color: "white", textTransform: "uppercase", letterSpacing: "0.06em" }}>Get Involved</span>
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", zIndex: 10, maxWidth: "62vw" }}>
        <h1
          style={{
            fontSize: "6vw",
            fontWeight: 800,
            lineHeight: 1.05,
            color: "white",
            margin: "0 0 4vh 0",
            letterSpacing: "-0.03em",
          }}
        >
          Let's Build the Future of Arab Youth Sports
          <span style={{ color: "#F97316" }}>.</span>
        </h1>

        <p style={{ fontSize: "1.6vw", color: "rgba(255,255,255,0.7)", margin: "0 0 5vh 0", fontWeight: 400, lineHeight: 1.5 }}>
          ناشئ — NASHE. A platform for every young athlete — boys and girls, every sport, across the Arab world.
        </p>

        {/* Contact row */}
        <div style={{ display: "flex", gap: "4vw" }}>
          <div>
            <div style={{ fontSize: "0.85vw", color: "#9CA3AF", marginBottom: "0.5vh", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>Platform</div>
            <div style={{ fontSize: "1.4vw", fontWeight: 600, color: "white" }}>nashe.app</div>
          </div>
          <div>
            <div style={{ fontSize: "0.85vw", color: "#9CA3AF", marginBottom: "0.5vh", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>Contact</div>
            <div style={{ fontSize: "1.4vw", fontWeight: 600, color: "white" }}>hello@nashe.app</div>
          </div>
          <div>
            <div style={{ fontSize: "0.85vw", color: "#9CA3AF", marginBottom: "0.5vh", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>Year</div>
            <div style={{ fontSize: "1.4vw", fontWeight: 600, color: "white" }}>2026</div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.85vw", color: "#6B7280", fontWeight: 500, zIndex: 10 }}>
        <div style={{ display: "flex", gap: "1.5vw" }}>
          <span>ناشئ — NASHE</span>
          <span>/</span>
          <span>Platform Overview</span>
          <span>/</span>
          <span>2026</span>
        </div>
        <div>09</div>
      </div>
    </div>
  );
}
