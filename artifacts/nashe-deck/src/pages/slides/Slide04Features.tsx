export default function Slide04Features() {
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
          top: "10vh",
          right: "6vw",
          width: "3vw",
          height: "3vw",
          borderRadius: "50%",
          backgroundColor: "#F97316",
          opacity: 0.15,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "15vh",
          left: "4vw",
          width: "5vw",
          height: "5vw",
          borderRadius: "50%",
          backgroundColor: "#1B5E3B",
          opacity: 0.06,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "40vh",
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
      <div style={{ marginBottom: "5vh" }}>
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
            Key Features
          </span>
        </div>
        <h1
          style={{
            fontSize: "3.8vw",
            fontWeight: 800,
            color: "#111827",
            margin: 0,
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
          }}
        >
          Built for every young athlete<span style={{ color: "#F97316" }}>.</span>
        </h1>
      </div>

      {/* Feature cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: "2.5vh", flex: 1, justifyContent: "center" }}>
        {/* Top 3 */}
        <div style={{ display: "flex", gap: "2.5vw" }}>
          {/* Feature 1 */}
          <div
            style={{
              flex: 1,
              backgroundColor: "white",
              borderRadius: "0.8vw",
              padding: "2.5vh 2vw",
              boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
              display: "flex",
              flexDirection: "column",
              gap: "1vh",
            }}
          >
            <div style={{ width: "2vw", height: "0.3vh", backgroundColor: "#1B5E3B" }} />
            <div style={{ fontSize: "1.5vw", fontWeight: 700, color: "#111827", letterSpacing: "-0.01em" }}>
              Discovery Feed
            </div>
            <div style={{ fontSize: "1.1vw", color: "#4B5563", lineHeight: 1.4 }}>
              Featured athletes, latest clips, rising talent, and sports news — all in one place.
            </div>
          </div>

          {/* Feature 2 */}
          <div
            style={{
              flex: 1,
              backgroundColor: "white",
              borderRadius: "0.8vw",
              padding: "2.5vh 2vw",
              boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
              display: "flex",
              flexDirection: "column",
              gap: "1vh",
            }}
          >
            <div style={{ width: "2vw", height: "0.3vh", backgroundColor: "#F97316" }} />
            <div style={{ fontSize: "1.5vw", fontWeight: 700, color: "#111827", letterSpacing: "-0.01em" }}>
              Upload Clips
            </div>
            <div style={{ fontSize: "1.1vw", color: "#4B5563", lineHeight: 1.4 }}>
              Coaches submit athlete video with sport, age, gender, and region details.
            </div>
          </div>

          {/* Feature 3 */}
          <div
            style={{
              flex: 1,
              backgroundColor: "white",
              borderRadius: "0.8vw",
              padding: "2.5vh 2vw",
              boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
              display: "flex",
              flexDirection: "column",
              gap: "1vh",
            }}
          >
            <div style={{ width: "2vw", height: "0.3vh", backgroundColor: "#1B5E3B" }} />
            <div style={{ fontSize: "1.5vw", fontWeight: 700, color: "#111827", letterSpacing: "-0.01em" }}>
              Athlete Profiles
            </div>
            <div style={{ fontSize: "1.1vw", color: "#4B5563", lineHeight: 1.4 }}>
              Full performance history, sport, stats, and clip gallery per athlete.
            </div>
          </div>
        </div>

        {/* Bottom 2 */}
        <div style={{ display: "flex", gap: "2.5vw" }}>
          {/* Feature 4 */}
          <div
            style={{
              flex: 1,
              backgroundColor: "#1B5E3B",
              borderRadius: "0.8vw",
              padding: "2.5vh 2vw",
              boxShadow: "0 4px 20px rgba(27,94,59,0.2)",
              display: "flex",
              flexDirection: "column",
              gap: "1vh",
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
            <div style={{ width: "2vw", height: "0.3vh", backgroundColor: "rgba(255,255,255,0.6)" }} />
            <div style={{ fontSize: "1.5vw", fontWeight: 700, color: "white", letterSpacing: "-0.01em" }}>
              All Sports
            </div>
            <div style={{ fontSize: "1.1vw", color: "rgba(255,255,255,0.75)", lineHeight: 1.4 }}>
              Football, basketball, swimming, athletics, tennis, and more — one unified platform.
            </div>
          </div>

          {/* Feature 5 */}
          <div
            style={{
              flex: 1,
              backgroundColor: "white",
              borderRadius: "0.8vw",
              padding: "2.5vh 2vw",
              boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
              display: "flex",
              flexDirection: "column",
              gap: "1vh",
            }}
          >
            <div style={{ width: "2vw", height: "0.3vh", backgroundColor: "#F97316" }} />
            <div style={{ fontSize: "1.5vw", fontWeight: 700, color: "#111827", letterSpacing: "-0.01em" }}>
              Arabic-First
            </div>
            <div style={{ fontSize: "1.1vw", color: "#4B5563", lineHeight: 1.4 }}>
              Full RTL interface, built for the Arab youth sports community.
            </div>
          </div>

          {/* Spacer */}
          <div style={{ flex: 1 }} />
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "3vh",
          fontSize: "0.85vw",
          color: "#9CA3AF",
          fontWeight: 500,
          borderTop: "1px solid rgba(0,0,0,0.05)",
          paddingTop: "2vh",
        }}
      >
        <div style={{ display: "flex", gap: "1.5vw" }}>
          <span>ناشئ — NASHE</span>
          <span>/</span>
          <span>Platform Overview</span>
        </div>
        <div style={{ fontWeight: 700, color: "#111827" }}>04</div>
      </div>
    </div>
  );
}
