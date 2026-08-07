export default function Slide02Problem() {
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
          right: "8vw",
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
          bottom: "12vh",
          left: "4vw",
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
          top: "45vh",
          left: "3.5vw",
          width: "1vw",
          height: "1vw",
          borderRadius: "0.2vw",
          backgroundColor: "#1B5E3B",
          opacity: 0.5,
          transform: "rotate(45deg)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "28vh",
          right: "5vw",
          width: "1.5vw",
          height: "1.5vw",
          borderRadius: "50%",
          border: "0.2vw solid #F97316",
          opacity: 0.3,
        }}
      />

      {/* Header */}
      <div style={{ marginBottom: "6vh" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5vw",
            padding: "0.5vh 1vw",
            backgroundColor: "rgba(27, 94, 59, 0.1)",
            borderRadius: "2vw",
            marginBottom: "2vh",
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
            The Problem
          </span>
        </div>

        <h1
          style={{
            fontSize: "4.2vw",
            fontWeight: 800,
            color: "#111827",
            margin: 0,
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
          }}
        >
          Young athletes go unseen<span style={{ color: "#F97316" }}>.</span>
        </h1>
      </div>

      {/* Four problem cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "2.5vh 4vw",
          flex: 1,
          alignContent: "start",
        }}
      >
        {/* Card 1 */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "0.8vw",
            padding: "3vh 2.5vw",
            boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
            display: "flex",
            flexDirection: "column",
            gap: "1.2vh",
          }}
        >
          <div style={{ width: "2.5vw", height: "0.3vh", backgroundColor: "#F97316" }} />
          <p
            style={{
              fontSize: "2vw",
              fontWeight: 700,
              color: "#111827",
              margin: 0,
              lineHeight: 1.25,
              letterSpacing: "-0.02em",
            }}
          >
            Thousands of youth athletes — boys and girls — go unnoticed every year
          </p>
        </div>

        {/* Card 2 */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "0.8vw",
            padding: "3vh 2.5vw",
            boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
            display: "flex",
            flexDirection: "column",
            gap: "1.2vh",
          }}
        >
          <div style={{ width: "2.5vw", height: "0.3vh", backgroundColor: "#F97316" }} />
          <p
            style={{
              fontSize: "2vw",
              fontWeight: 700,
              color: "#111827",
              margin: 0,
              lineHeight: 1.25,
              letterSpacing: "-0.02em",
            }}
          >
            Coaches rely on word-of-mouth and expensive in-person trials
          </p>
        </div>

        {/* Card 3 */}
        <div
          style={{
            backgroundColor: "#1B5E3B",
            borderRadius: "0.8vw",
            padding: "3vh 2.5vw",
            boxShadow: "0 4px 20px rgba(27,94,59,0.2)",
            display: "flex",
            flexDirection: "column",
            gap: "1.2vh",
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
              backgroundColor: "rgba(255,255,255,0.06)",
            }}
          />
          <div style={{ width: "2.5vw", height: "0.3vh", backgroundColor: "rgba(255,255,255,0.6)" }} />
          <p
            style={{
              fontSize: "2vw",
              fontWeight: 700,
              color: "white",
              margin: 0,
              lineHeight: 1.25,
              letterSpacing: "-0.02em",
            }}
          >
            No Arabic-language platform exists for multi-sport youth talent
          </p>
        </div>

        {/* Card 4 */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "0.8vw",
            padding: "3vh 2.5vw",
            boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
            display: "flex",
            flexDirection: "column",
            gap: "1.2vh",
          }}
        >
          <div style={{ width: "2.5vw", height: "0.3vh", backgroundColor: "#F97316" }} />
          <p
            style={{
              fontSize: "2vw",
              fontWeight: 700,
              color: "#111827",
              margin: 0,
              lineHeight: 1.25,
              letterSpacing: "-0.02em",
            }}
          >
            Young athletes have no simple way to showcase their skills and get discovered
          </p>
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
        <div style={{ fontWeight: 700, color: "#111827" }}>02</div>
      </div>
    </div>
  );
}
