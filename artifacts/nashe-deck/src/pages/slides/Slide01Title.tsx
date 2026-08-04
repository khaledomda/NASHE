const base = import.meta.env.BASE_URL;

export default function Slide01Title() {
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
      }}
    >
      {/* Background geometric accents */}
      <div
        style={{
          position: "absolute",
          top: "15vh",
          left: "8vw",
          width: "2vw",
          height: "2vw",
          borderRadius: "50%",
          backgroundColor: "#F97316",
          opacity: 0.25,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "20vh",
          left: "40vw",
          width: "4vw",
          height: "4vw",
          borderRadius: "50%",
          backgroundColor: "#1B5E3B",
          opacity: 0.12,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "10vh",
          right: "47vw",
          width: "1.5vw",
          height: "1.5vw",
          borderRadius: "0.2vw",
          backgroundColor: "#1B5E3B",
          opacity: 0.7,
          transform: "rotate(45deg)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "35vh",
          left: "5vw",
          width: "3vw",
          height: "3vw",
          borderRadius: "50%",
          backgroundColor: "#1B5E3B",
          opacity: 0.06,
        }}
      />

      {/* Left Content Side */}
      <div
        style={{
          width: "46vw",
          height: "100vh",
          padding: "6vh 6vw 6vh 7vw",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          zIndex: 10,
          boxSizing: "border-box",
        }}
      >
        {/* Logo / Brand mark */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.8vw" }}>
          <div
            style={{
              width: "1.5vw",
              height: "1.5vw",
              backgroundColor: "#1B5E3B",
              borderRadius: "0.3vw",
            }}
          />
          <div
            style={{
              fontSize: "1.2vw",
              fontWeight: 700,
              color: "#111827",
              letterSpacing: "-0.02em",
            }}
          >
            ناشئ — NASHE
          </div>
        </div>

        {/* Main content block */}
        <div style={{ display: "flex", flexDirection: "column", gap: "2.5vh", marginTop: "-8vh" }}>
          {/* Category badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5vw",
              padding: "0.5vh 1vw",
              backgroundColor: "rgba(27, 94, 59, 0.1)",
              borderRadius: "2vw",
              width: "fit-content",
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
              Youth Sports Talent Platform
            </span>
          </div>

          {/* Headline */}
          <h1
            style={{
              fontSize: "5.8vw",
              fontWeight: 800,
              lineHeight: 1.0,
              color: "#111827",
              margin: 0,
              letterSpacing: "-0.03em",
            }}
          >
            Discover
            <br />
            Young
            <br />
            Talent
            <span style={{ color: "#F97316" }}>.</span>
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontSize: "1.35vw",
              color: "#4B5563",
              lineHeight: 1.55,
              margin: 0,
              maxWidth: "28vw",
              fontWeight: 400,
            }}
          >
            Connecting youth sports talent — boys and girls — with coaches and clubs across the Arab world.
          </p>

          {/* Divider */}
          <div style={{ width: "4vw", height: "0.3vh", backgroundColor: "#111827", marginTop: "0.5vh" }} />
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            gap: "1.5vw",
            fontSize: "0.85vw",
            color: "#9CA3AF",
            fontWeight: 500,
          }}
        >
          <span>ناشئ — NASHE</span>
          <span>/</span>
          <span>Platform Overview</span>
          <span>/</span>
          <span>2026</span>
        </div>
      </div>

      {/* Right Image Side */}
      <div
        style={{
          width: "54vw",
          height: "100vh",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: "48vw",
            height: "48vw",
            backgroundColor: "rgba(27, 94, 59, 0.04)",
            borderRadius: "50%",
            zIndex: 1,
            right: "-12vw",
            top: "50%",
            transform: "translateY(-50%)",
          }}
        />
        <img
          src={`${base}sports-hero.jpg`}
          crossOrigin="anonymous"
          alt="Youth athletes in various sports"
          style={{
            width: "90%",
            height: "90%",
            objectFit: "cover",
            zIndex: 2,
            position: "relative",
            borderRadius: "1.5vw",
            boxShadow: "0 2vw 5vw rgba(0,0,0,0.12)",
          }}
        />
      </div>
    </div>
  );
}
