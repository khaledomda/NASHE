export default function Slide07TechStack() {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        backgroundColor: "#FAFAFA",
        fontFamily: "'DM Sans', sans-serif",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        padding: "7vh 8vw",
        boxSizing: "border-box",
      }}
    >
      {/* Background accents */}
      <div
        style={{
          position: "absolute",
          top: "8vh",
          right: "5vw",
          width: "2.5vw",
          height: "2.5vw",
          borderRadius: "50%",
          backgroundColor: "#F97316",
          opacity: 0.15,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "20vh",
          left: "3vw",
          width: "6vw",
          height: "6vw",
          borderRadius: "50%",
          backgroundColor: "#1B5E3B",
          opacity: 0.06,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "50vh",
          right: "4vw",
          width: "1vw",
          height: "1vw",
          borderRadius: "0.2vw",
          backgroundColor: "#1B5E3B",
          opacity: 0.5,
          transform: "rotate(45deg)",
        }}
      />

      {/* Header */}
      <div style={{ marginBottom: "5.5vh" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5vw",
            padding: "0.5vh 1vw",
            backgroundColor: "rgba(27, 94, 59, 0.1)",
            borderRadius: "2vw",
            marginBottom: "1.8vh",
          }}
        >
          <div
            style={{
              width: "0.5vw",
              height: "0.5vw",
              backgroundColor: "#1B5E3B",
              borderRadius: "50%",
            }}
          />
          <span
            style={{
              fontSize: "0.9vw",
              fontWeight: 600,
              color: "#1B5E3B",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            Technology Stack
          </span>
        </div>
        <h1
          style={{
            fontSize: "4vw",
            fontWeight: 800,
            color: "#111827",
            margin: 0,
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
          }}
        >
          TypeScript end-to-end<span style={{ color: "#F97316" }}>.</span>
        </h1>
      </div>

      {/* Two-column layout: left stats, right tech cards */}
      <div style={{ display: "flex", gap: "4vw", flex: 1 }}>
        {/* Left: two hero stats */}
        <div style={{ width: "22vw", display: "flex", flexDirection: "column", gap: "3vh" }}>
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "0.8vw",
              padding: "3vh 2.5vw",
              boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <div style={{ width: "2vw", height: "0.3vh", backgroundColor: "#F97316", marginBottom: "1.5vh" }} />
            <div style={{ fontSize: "5vw", fontWeight: 800, color: "#111827", lineHeight: 1, letterSpacing: "-0.04em" }}>iOS</div>
            <div style={{ fontSize: "5vw", fontWeight: 800, color: "#1B5E3B", lineHeight: 1, letterSpacing: "-0.04em" }}>+ Android</div>
            <p style={{ fontSize: "1.1vw", color: "#4B5563", margin: "1.5vh 0 0 0", fontWeight: 500 }}>Cross-platform mobile</p>
          </div>

          <div
            style={{
              backgroundColor: "#1B5E3B",
              borderRadius: "0.8vw",
              padding: "3vh 2.5vw",
              boxShadow: "0 4px 20px rgba(27,94,59,0.2)",
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              color: "white",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "-2vw",
                right: "-2vw",
                width: "8vw",
                height: "8vw",
                borderRadius: "50%",
                backgroundColor: "rgba(255,255,255,0.07)",
              }}
            />
            <div style={{ width: "2vw", height: "0.3vh", backgroundColor: "rgba(255,255,255,0.6)", marginBottom: "1.5vh" }} />
            <div style={{ fontSize: "3.5vw", fontWeight: 800, lineHeight: 1, letterSpacing: "-0.04em" }}>Mono</div>
            <div style={{ fontSize: "3.5vw", fontWeight: 800, lineHeight: 1, letterSpacing: "-0.04em", opacity: 0.6 }}>repo</div>
            <p style={{ fontSize: "1.1vw", margin: "1.5vh 0 0 0", fontWeight: 500, opacity: 0.85 }}>pnpm workspace</p>
          </div>
        </div>

        {/* Right: 5 tech items in a grid */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "2vh" }}>
          {/* Row 1 */}
          <div style={{ display: "flex", gap: "2vw" }}>
            <div
              style={{
                flex: 1,
                backgroundColor: "white",
                borderRadius: "0.8vw",
                padding: "2.5vh 2vw",
                boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
                display: "flex",
                flexDirection: "column",
                gap: "0.8vh",
              }}
            >
              <div style={{ width: "1.5vw", height: "0.25vh", backgroundColor: "#1B5E3B" }} />
              <div style={{ fontSize: "1.3vw", fontWeight: 700, color: "#111827" }}>Expo / React Native</div>
              <div style={{ fontSize: "1vw", color: "#4B5563" }}>Mobile — iOS and Android</div>
            </div>
            <div
              style={{
                flex: 1,
                backgroundColor: "white",
                borderRadius: "0.8vw",
                padding: "2.5vh 2vw",
                boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
                display: "flex",
                flexDirection: "column",
                gap: "0.8vh",
              }}
            >
              <div style={{ width: "1.5vw", height: "0.25vh", backgroundColor: "#F97316" }} />
              <div style={{ fontSize: "1.3vw", fontWeight: 700, color: "#111827" }}>Node.js API Server</div>
              <div style={{ fontSize: "1vw", color: "#4B5563" }}>RESTful endpoints, session auth</div>
            </div>
          </div>

          {/* Row 2 */}
          <div style={{ display: "flex", gap: "2vw" }}>
            <div
              style={{
                flex: 1,
                backgroundColor: "white",
                borderRadius: "0.8vw",
                padding: "2.5vh 2vw",
                boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
                display: "flex",
                flexDirection: "column",
                gap: "0.8vh",
              }}
            >
              <div style={{ width: "1.5vw", height: "0.25vh", backgroundColor: "#1B5E3B" }} />
              <div style={{ fontSize: "1.3vw", fontWeight: 700, color: "#111827" }}>TypeScript</div>
              <div style={{ fontSize: "1vw", color: "#4B5563" }}>Type-safe across the full stack</div>
            </div>
            <div
              style={{
                flex: 1,
                backgroundColor: "white",
                borderRadius: "0.8vw",
                padding: "2.5vh 2vw",
                boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
                display: "flex",
                flexDirection: "column",
                gap: "0.8vh",
              }}
            >
              <div style={{ width: "1.5vw", height: "0.25vh", backgroundColor: "#F97316" }} />
              <div style={{ fontSize: "1.3vw", fontWeight: 700, color: "#111827" }}>PostgreSQL</div>
              <div style={{ fontSize: "1vw", color: "#4B5563" }}>Players, clips, and news</div>
            </div>
          </div>

          {/* Row 3 — single wide card */}
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "0.8vw",
              padding: "2.5vh 2vw",
              boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
              display: "flex",
              alignItems: "center",
              gap: "2vw",
            }}
          >
            <div style={{ flex: 1 }}>
              <div style={{ width: "1.5vw", height: "0.25vh", backgroundColor: "#1B5E3B", marginBottom: "0.8vh" }} />
              <div style={{ fontSize: "1.3vw", fontWeight: 700, color: "#111827" }}>pnpm Workspace</div>
              <div style={{ fontSize: "1vw", color: "#4B5563" }}>Shared types between mobile and API — one repo, zero drift</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "3.5vh",
          fontSize: "0.85vw",
          color: "#9CA3AF",
          fontWeight: 500,
          borderTop: "1px solid rgba(0,0,0,0.05)",
          paddingTop: "2vh",
        }}
      >
        <div style={{ display: "flex", gap: "1.5vw" }}>
          <span>ناشي — Nashe</span>
          <span>/</span>
          <span>Platform Overview</span>
        </div>
        <div style={{ fontWeight: 700, color: "#111827" }}>07</div>
      </div>
    </div>
  );
}
