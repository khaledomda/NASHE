export default function Slide03Solution() {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        backgroundColor: "#111827",
        fontFamily: "'DM Sans', sans-serif",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        padding: "7vh 8vw",
        boxSizing: "border-box",
        color: "white",
      }}
    >
      {/* Glowing background blobs */}
      <div
        style={{
          position: "absolute",
          top: "-15vw",
          right: "-5vw",
          width: "40vw",
          height: "40vw",
          borderRadius: "50%",
          backgroundColor: "#1B5E3B",
          opacity: 0.25,
          filter: "blur(5vw)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-10vw",
          left: "-5vw",
          width: "30vw",
          height: "30vw",
          borderRadius: "50%",
          backgroundColor: "#F97316",
          opacity: 0.08,
          filter: "blur(4vw)",
        }}
      />

      {/* Geometric accents */}
      <div
        style={{
          position: "absolute",
          bottom: "18vh",
          left: "8vw",
          width: "2vw",
          height: "2vw",
          borderRadius: "50%",
          backgroundColor: "#F97316",
          opacity: 0.8,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "24vh",
          left: "40vw",
          width: "1.5vw",
          height: "1.5vw",
          borderRadius: "0.2vw",
          backgroundColor: "#1B5E3B",
          opacity: 0.6,
          transform: "rotate(45deg)",
        }}
      />

      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          zIndex: 10,
          marginBottom: "6vh",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5vw",
            padding: "0.5vh 1vw",
            backgroundColor: "rgba(255,255,255,0.1)",
            borderRadius: "2vw",
          }}
        >
          <span
            style={{
              fontSize: "0.9vw",
              fontWeight: 600,
              color: "white",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            The Solution
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.8vw" }}>
          <div
            style={{
              width: "1.5vw",
              height: "1.5vw",
              backgroundColor: "#F97316",
              borderRadius: "0.3vw",
            }}
          />
          <div style={{ fontSize: "1.2vw", fontWeight: 700, color: "white" }}>
            ناشي — Nashe
          </div>
        </div>
      </div>

      {/* Main content */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          zIndex: 10,
        }}
      >
        <h1
          style={{
            fontSize: "4.5vw",
            fontWeight: 800,
            lineHeight: 1.15,
            color: "white",
            margin: "0 0 4vh 0",
            letterSpacing: "-0.03em",
            maxWidth: "72vw",
          }}
        >
          A mobile-first Arabic platform that connects football scouts with emerging talent across the Arab world
          <span style={{ color: "#F97316" }}>.</span>
        </h1>

        {/* Three pillars */}
        <div style={{ display: "flex", gap: "3vw", marginTop: "2vh" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "1vw" }}>
            <div
              style={{
                width: "0.5vw",
                height: "0.5vw",
                borderRadius: "50%",
                backgroundColor: "#F97316",
                marginTop: "0.9vw",
                flexShrink: 0,
              }}
            />
            <p style={{ fontSize: "1.6vw", color: "rgba(255,255,255,0.75)", margin: 0, fontWeight: 500, lineHeight: 1.4 }}>
              Short video clips
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "1vw" }}>
            <div
              style={{
                width: "0.5vw",
                height: "0.5vw",
                borderRadius: "50%",
                backgroundColor: "#F97316",
                marginTop: "0.9vw",
                flexShrink: 0,
              }}
            />
            <p style={{ fontSize: "1.6vw", color: "rgba(255,255,255,0.75)", margin: 0, fontWeight: 500, lineHeight: 1.4 }}>
              Player profiles
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "1vw" }}>
            <div
              style={{
                width: "0.5vw",
                height: "0.5vw",
                borderRadius: "50%",
                backgroundColor: "#F97316",
                marginTop: "0.9vw",
                flexShrink: 0,
              }}
            />
            <p style={{ fontSize: "1.6vw", color: "rgba(255,255,255,0.75)", margin: 0, fontWeight: 500, lineHeight: 1.4 }}>
              Curated discovery feed
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: "0.85vw",
          color: "#6B7280",
          fontWeight: 500,
          zIndex: 10,
        }}
      >
        <div style={{ display: "flex", gap: "1.5vw" }}>
          <span>ناشي — Nashe</span>
          <span>/</span>
          <span>Platform Overview</span>
          <span>/</span>
          <span>2026</span>
        </div>
        <div>03</div>
      </div>
    </div>
  );
}
