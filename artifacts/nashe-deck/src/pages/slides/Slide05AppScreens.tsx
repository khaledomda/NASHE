export default function Slide05AppScreens() {
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
          top: "12vh",
          right: "7vw",
          width: "2.5vw",
          height: "2.5vw",
          borderRadius: "50%",
          backgroundColor: "#F97316",
          opacity: 0.18,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "18vh",
          left: "3vw",
          width: "5vw",
          height: "5vw",
          borderRadius: "50%",
          backgroundColor: "#1B5E3B",
          opacity: 0.06,
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
            App Screens
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
          Three core screens<span style={{ color: "#F97316" }}>.</span>
        </h1>
        <p style={{ fontSize: "1.3vw", color: "#4B5563", margin: "1.5vh 0 0 0", fontWeight: 400 }}>
          Built with Expo React Native — cross-platform iOS and Android.
        </p>
      </div>

      {/* Screen cards */}
      <div style={{ display: "flex", gap: "3vw", flex: 1, alignItems: "center" }}>
        {/* Login Screen */}
        <div
          style={{
            flex: 1,
            height: "48vh",
            backgroundColor: "#1B5E3B",
            borderRadius: "1.2vw",
            padding: "3vh 2.5vw",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 1vw 3vw rgba(27,94,59,0.25)",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "-4vw",
              right: "-4vw",
              width: "16vw",
              height: "16vw",
              borderRadius: "50%",
              backgroundColor: "rgba(255,255,255,0.05)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "-3vw",
              left: "-3vw",
              width: "10vw",
              height: "10vw",
              borderRadius: "50%",
              backgroundColor: "rgba(255,255,255,0.04)",
            }}
          />
          <div>
            <div
              style={{
                width: "3vw",
                height: "3vw",
                borderRadius: "50%",
                backgroundColor: "rgba(255,255,255,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "2vh",
              }}
            >
              <div style={{ width: "1.5vw", height: "1.5vw", borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.5)" }} />
            </div>
            <div style={{ fontSize: "2vw", fontWeight: 800, color: "white", marginBottom: "0.8vh" }}>ناشئ</div>
            <div style={{ fontSize: "1.1vw", color: "rgba(255,255,255,0.65)", lineHeight: 1.4 }}>
              Secure entry point with Arabic branding
            </div>
          </div>
          <div>
            <div style={{ backgroundColor: "rgba(255,255,255,0.12)", borderRadius: "0.5vw", height: "3.5vh", marginBottom: "1.2vh" }} />
            <div style={{ backgroundColor: "rgba(255,255,255,0.12)", borderRadius: "0.5vw", height: "3.5vh", marginBottom: "2vh" }} />
            <div
              style={{
                backgroundColor: "white",
                borderRadius: "0.5vw",
                height: "4vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div style={{ fontSize: "1.1vw", fontWeight: 700, color: "#1B5E3B" }}>تسجيل الدخول</div>
            </div>
          </div>
          <div style={{ fontSize: "1vw", fontWeight: 700, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Login
          </div>
        </div>

        {/* Home Screen */}
        <div
          style={{
            flex: 1,
            height: "48vh",
            backgroundColor: "white",
            borderRadius: "1.2vw",
            padding: "3vh 2.5vw",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            boxShadow: "0 1vw 3vw rgba(0,0,0,0.08)",
          }}
        >
          <div>
            <div
              style={{
                backgroundColor: "#1B5E3B",
                borderRadius: "0.5vw",
                height: "5vh",
                marginBottom: "2vh",
                display: "flex",
                alignItems: "center",
                paddingLeft: "1vw",
              }}
            >
              <div style={{ fontSize: "1.1vw", fontWeight: 700, color: "white" }}>الرئيسية</div>
            </div>
            <div style={{ fontSize: "0.9vw", color: "#6B7280", marginBottom: "1vh" }}>Featured Athletes</div>
            <div style={{ backgroundColor: "#F3F4F6", borderRadius: "0.5vw", height: "12vh", marginBottom: "1.5vh" }} />
            <div style={{ fontSize: "0.9vw", color: "#6B7280", marginBottom: "1vh" }}>Latest Clips</div>
            <div style={{ display: "flex", gap: "1vw" }}>
              <div style={{ backgroundColor: "#F3F4F6", borderRadius: "0.5vw", height: "6vh", flex: 1 }} />
              <div style={{ backgroundColor: "#F3F4F6", borderRadius: "0.5vw", height: "6vh", flex: 1 }} />
            </div>
          </div>
          <div style={{ fontSize: "1vw", fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Discovery Feed
          </div>
        </div>

        {/* Upload Screen */}
        <div
          style={{
            flex: 1,
            height: "48vh",
            backgroundColor: "white",
            borderRadius: "1.2vw",
            padding: "3vh 2.5vw",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            boxShadow: "0 1vw 3vw rgba(0,0,0,0.08)",
          }}
        >
          <div>
            <div style={{ fontSize: "1.4vw", fontWeight: 700, color: "#111827", marginBottom: "2vh" }}>
              رفع المقاطع
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.2vh" }}>
              <div style={{ backgroundColor: "#F3F4F6", borderRadius: "0.4vw", height: "3.5vh" }} />
              <div style={{ backgroundColor: "#F3F4F6", borderRadius: "0.4vw", height: "3.5vh" }} />
              <div style={{ backgroundColor: "#F3F4F6", borderRadius: "0.4vw", height: "3.5vh" }} />
              <div style={{ backgroundColor: "#F3F4F6", borderRadius: "0.4vw", height: "6vh" }} />
            </div>
          </div>
          <div
            style={{
              backgroundColor: "#1B5E3B",
              borderRadius: "0.5vw",
              height: "4vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop: "1.5vh",
            }}
          >
            <div style={{ fontSize: "1.1vw", fontWeight: 700, color: "white" }}>رفع المقطع</div>
          </div>
          <div style={{ fontSize: "1vw", fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Upload Clips
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
          <span>ناشئ — NASHE</span>
          <span>/</span>
          <span>Platform Overview</span>
        </div>
        <div style={{ fontWeight: 700, color: "#111827" }}>05</div>
      </div>
    </div>
  );
}
