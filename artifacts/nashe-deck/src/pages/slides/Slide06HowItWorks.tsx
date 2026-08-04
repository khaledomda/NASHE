export default function Slide06HowItWorks() {
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
      <div style={{ position: "absolute", top: "10vh", right: "8vw", width: "2.5vw", height: "2.5vw", borderRadius: "50%", backgroundColor: "#F97316", opacity: 0.15 }} />
      <div style={{ position: "absolute", bottom: "15vh", left: "4vw", width: "5vw", height: "5vw", borderRadius: "50%", backgroundColor: "#1B5E3B", opacity: 0.06 }} />

      {/* Header */}
      <div style={{ marginBottom: "6vh" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5vw", padding: "0.5vh 1vw", backgroundColor: "rgba(27, 94, 59, 0.1)", borderRadius: "2vw", marginBottom: "1.8vh" }}>
          <div style={{ width: "0.5vw", height: "0.5vw", backgroundColor: "#1B5E3B", borderRadius: "50%" }} />
          <span style={{ fontSize: "0.9vw", fontWeight: 600, color: "#1B5E3B", textTransform: "uppercase", letterSpacing: "0.06em" }}>How It Works</span>
        </div>
        <h1 style={{ fontSize: "4vw", fontWeight: 800, color: "#111827", margin: 0, letterSpacing: "-0.03em", lineHeight: 1.1 }}>
          From coach to discovery in four steps<span style={{ color: "#F97316" }}>.</span>
        </h1>
      </div>

      {/* Steps */}
      <div style={{ display: "flex", gap: "2vw", flex: 1, alignItems: "center" }}>
        {/* Step 1 */}
        <div style={{ flex: 1, backgroundColor: "white", borderRadius: "0.8vw", padding: "3.5vh 2vw", boxShadow: "0 4px 20px rgba(0,0,0,0.04)", display: "flex", flexDirection: "column", gap: "1.5vh", height: "42vh" }}>
          <div style={{ width: "4vw", height: "4vw", borderRadius: "50%", backgroundColor: "rgba(27, 94, 59, 0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: "1.8vw", fontWeight: 800, color: "#1B5E3B" }}>01</span>
          </div>
          <div style={{ width: "2vw", height: "0.3vh", backgroundColor: "#1B5E3B" }} />
          <div style={{ fontSize: "1.5vw", fontWeight: 700, color: "#111827", lineHeight: 1.2 }}>Log In</div>
          <div style={{ fontSize: "1.1vw", color: "#4B5563", lineHeight: 1.45 }}>Coach logs in securely to their ناشئ account.</div>
        </div>

        <div style={{ fontSize: "2vw", color: "#D1D5DB", fontWeight: 300, flexShrink: 0 }}>—</div>

        {/* Step 2 */}
        <div style={{ flex: 1, backgroundColor: "white", borderRadius: "0.8vw", padding: "3.5vh 2vw", boxShadow: "0 4px 20px rgba(0,0,0,0.04)", display: "flex", flexDirection: "column", gap: "1.5vh", height: "42vh" }}>
          <div style={{ width: "4vw", height: "4vw", borderRadius: "50%", backgroundColor: "rgba(249, 115, 22, 0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: "1.8vw", fontWeight: 800, color: "#F97316" }}>02</span>
          </div>
          <div style={{ width: "2vw", height: "0.3vh", backgroundColor: "#F97316" }} />
          <div style={{ fontSize: "1.5vw", fontWeight: 700, color: "#111827", lineHeight: 1.2 }}>Film and Upload</div>
          <div style={{ fontSize: "1.1vw", color: "#4B5563", lineHeight: 1.45 }}>Coach films the athlete and uploads a clip with sport, age, gender, and region.</div>
        </div>

        <div style={{ fontSize: "2vw", color: "#D1D5DB", fontWeight: 300, flexShrink: 0 }}>—</div>

        {/* Step 3 */}
        <div style={{ flex: 1, backgroundColor: "#1B5E3B", borderRadius: "0.8vw", padding: "3.5vh 2vw", boxShadow: "0 4px 20px rgba(27,94,59,0.2)", display: "flex", flexDirection: "column", gap: "1.5vh", height: "42vh", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: "-2vw", right: "-2vw", width: "8vw", height: "8vw", borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.06)" }} />
          <div style={{ width: "4vw", height: "4vw", borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: "1.8vw", fontWeight: 800, color: "white" }}>03</span>
          </div>
          <div style={{ width: "2vw", height: "0.3vh", backgroundColor: "rgba(255,255,255,0.5)" }} />
          <div style={{ fontSize: "1.5vw", fontWeight: 700, color: "white", lineHeight: 1.2 }}>Clip Goes Live</div>
          <div style={{ fontSize: "1.1vw", color: "rgba(255,255,255,0.75)", lineHeight: 1.45 }}>Clip appears in the discovery feed for clubs and talent selectors across the Arab world.</div>
        </div>

        <div style={{ fontSize: "2vw", color: "#D1D5DB", fontWeight: 300, flexShrink: 0 }}>—</div>

        {/* Step 4 */}
        <div style={{ flex: 1, backgroundColor: "white", borderRadius: "0.8vw", padding: "3.5vh 2vw", boxShadow: "0 4px 20px rgba(0,0,0,0.04)", display: "flex", flexDirection: "column", gap: "1.5vh", height: "42vh" }}>
          <div style={{ width: "4vw", height: "4vw", borderRadius: "50%", backgroundColor: "rgba(27, 94, 59, 0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: "1.8vw", fontWeight: 800, color: "#1B5E3B" }}>04</span>
          </div>
          <div style={{ width: "2vw", height: "0.3vh", backgroundColor: "#1B5E3B" }} />
          <div style={{ fontSize: "1.5vw", fontWeight: 700, color: "#111827", lineHeight: 1.2 }}>Connect</div>
          <div style={{ fontSize: "1.1vw", color: "#4B5563", lineHeight: 1.45 }}>Interested clubs view the athlete's full profile and contact the coach directly.</div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "3.5vh", fontSize: "0.85vw", color: "#9CA3AF", fontWeight: 500, borderTop: "1px solid rgba(0,0,0,0.05)", paddingTop: "2vh" }}>
        <div style={{ display: "flex", gap: "1.5vw" }}>
          <span>ناشئ — NASHE</span>
          <span>/</span>
          <span>Platform Overview</span>
        </div>
        <div style={{ fontWeight: 700, color: "#111827" }}>06</div>
      </div>
    </div>
  );
}
