export default function Slide08Roadmap() {
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
          right: "7vw",
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
          bottom: "18vh",
          left: "4vw",
          width: "5vw",
          height: "5vw",
          borderRadius: "50%",
          backgroundColor: "#1B5E3B",
          opacity: 0.06,
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
            Roadmap
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
          What comes next<span style={{ color: "#F97316" }}>.</span>
        </h1>
      </div>

      {/* Phase cards — vertical stack */}
      <div style={{ display: "flex", flexDirection: "column", gap: "2.2vh", flex: 1, justifyContent: "center" }}>
        {/* Phase 1 — Complete */}
        <div
          style={{
            backgroundColor: "#1B5E3B",
            borderRadius: "0.8vw",
            padding: "2.5vh 2.5vw",
            display: "flex",
            alignItems: "center",
            gap: "2.5vw",
            boxShadow: "0 4px 20px rgba(27,94,59,0.2)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              right: "-3vw",
              top: "50%",
              transform: "translateY(-50%)",
              width: "12vw",
              height: "12vw",
              borderRadius: "50%",
              backgroundColor: "rgba(255,255,255,0.05)",
            }}
          />
          <div
            style={{
              fontSize: "1.4vw",
              fontWeight: 800,
              color: "rgba(255,255,255,0.5)",
              minWidth: "8vw",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            Phase 1
          </div>
          <div style={{ width: "1px", height: "4vh", backgroundColor: "rgba(255,255,255,0.2)" }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "1.5vw", fontWeight: 700, color: "white", marginBottom: "0.5vh" }}>
              Mobile App — Login, Feed, and Upload Screens
            </div>
            <div style={{ fontSize: "1.05vw", color: "rgba(255,255,255,0.65)" }}>
              Expo React Native app fully built and running.
            </div>
          </div>
          <div
            style={{
              backgroundColor: "rgba(255,255,255,0.15)",
              borderRadius: "2vw",
              padding: "0.5vh 1.2vw",
              fontSize: "0.9vw",
              fontWeight: 700,
              color: "white",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              flexShrink: 0,
            }}
          >
            Complete
          </div>
        </div>

        {/* Phase 2 */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "0.8vw",
            padding: "2.5vh 2.5vw",
            display: "flex",
            alignItems: "center",
            gap: "2.5vw",
            boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
          }}
        >
          <div
            style={{
              fontSize: "1.4vw",
              fontWeight: 800,
              color: "#D1D5DB",
              minWidth: "8vw",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            Phase 2
          </div>
          <div style={{ width: "1px", height: "4vh", backgroundColor: "#E5E7EB" }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "1.5vw", fontWeight: 700, color: "#111827", marginBottom: "0.5vh" }}>
              Real Backend — Player and Clip Persistence, API Integration
            </div>
            <div style={{ fontSize: "1.05vw", color: "#4B5563" }}>
              Connect the mobile app to a live API and database.
            </div>
          </div>
          <div
            style={{
              backgroundColor: "#F3F4F6",
              borderRadius: "2vw",
              padding: "0.5vh 1.2vw",
              fontSize: "0.9vw",
              fontWeight: 700,
              color: "#6B7280",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              flexShrink: 0,
            }}
          >
            In Progress
          </div>
        </div>

        {/* Phase 3 */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "0.8vw",
            padding: "2.5vh 2.5vw",
            display: "flex",
            alignItems: "center",
            gap: "2.5vw",
            boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
          }}
        >
          <div
            style={{
              fontSize: "1.4vw",
              fontWeight: 800,
              color: "#D1D5DB",
              minWidth: "8vw",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            Phase 3
          </div>
          <div style={{ width: "1px", height: "4vh", backgroundColor: "#E5E7EB" }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "1.5vw", fontWeight: 700, color: "#111827", marginBottom: "0.5vh" }}>
              Player Profile Pages — Full Clip History and Stats
            </div>
            <div style={{ fontSize: "1.05vw", color: "#4B5563" }}>
              Rich per-player views for scouts and clubs to review talent in depth.
            </div>
          </div>
          <div
            style={{
              backgroundColor: "#F3F4F6",
              borderRadius: "2vw",
              padding: "0.5vh 1.2vw",
              fontSize: "0.9vw",
              fontWeight: 700,
              color: "#9CA3AF",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              flexShrink: 0,
            }}
          >
            Planned
          </div>
        </div>

        {/* Phase 4 */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "0.8vw",
            padding: "2.5vh 2.5vw",
            display: "flex",
            alignItems: "center",
            gap: "2.5vw",
            boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
          }}
        >
          <div
            style={{
              fontSize: "1.4vw",
              fontWeight: 800,
              color: "#D1D5DB",
              minWidth: "8vw",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            Phase 4
          </div>
          <div style={{ width: "1px", height: "4vh", backgroundColor: "#E5E7EB" }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "1.5vw", fontWeight: 700, color: "#111827", marginBottom: "0.5vh" }}>
              Scout-to-Club Messaging, Push Notifications, Analytics
            </div>
            <div style={{ fontSize: "1.05vw", color: "#4B5563" }}>
              Complete ecosystem for Arab football talent management at scale.
            </div>
          </div>
          <div
            style={{
              backgroundColor: "#F3F4F6",
              borderRadius: "2vw",
              padding: "0.5vh 1.2vw",
              fontSize: "0.9vw",
              fontWeight: 700,
              color: "#9CA3AF",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              flexShrink: 0,
            }}
          >
            Future
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
        <div style={{ fontWeight: 700, color: "#111827" }}>08</div>
      </div>
    </div>
  );
}
