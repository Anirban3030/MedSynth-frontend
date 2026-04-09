import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { healthCheck, analyze } from "../api/medsynth";

const EXAMPLES = [
  "Does vitamin D supplementation prevent cardiovascular disease and mortality?",
  "Is hormone replacement therapy safe for postmenopausal women?",
  "Do statins reduce cardiovascular risk in elderly patients without prior heart disease?",
  "Does regular coffee consumption reduce the risk of type 2 diabetes?",
];

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("idle"); // idle | checking | error
  const [backendOk, setBackendOk] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setStatus("checking");
    healthCheck()
      .then(() => {
        setBackendOk(true);
        setStatus("idle");
      })
      .catch(() => {
        setBackendOk(false);
        setStatus("idle");
      });
  }, []);

  const handleSubmit = (q) => {
    const trimmed = (q || query).trim();
    if (!trimmed) return;
    // Store query and navigate to pipeline
    sessionStorage.setItem("ms_query", trimmed);
    navigate("/pipeline");
  };

  return (
    <div
      className="grid-bg"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
      }}
    >
      {/* Glow */}
      <div
        style={{
          position: "fixed",
          top: "20%",
          left: "50%",
          transform: "translateX(-50%)",
          width: 600,
          height: 300,
          background:
            "radial-gradient(ellipse, rgba(45,212,191,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Logo */}
      <div
        style={{
          textAlign: "center",
          marginBottom: 48,
          animation: "fadeUp 0.6s ease both",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            marginBottom: 16,
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: "linear-gradient(135deg, var(--teal), var(--blue2))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
            }}
          >
            ⬡
          </div>
          <h1
            style={{
              fontFamily: "DM Serif Display",
              fontSize: 42,
              margin: 0,
              background: "linear-gradient(135deg, var(--teal), var(--blue))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            MedSynth
          </h1>
        </div>
        <p
          style={{
            color: "var(--muted)",
            fontSize: 16,
            margin: 0,
            maxWidth: 480,
            lineHeight: 1.6,
          }}
        >
          Multi-agent medical literature synthesis. Ask a clinical question —
          get evidence-scored papers, contradiction analysis, and a structured
          report.
        </p>
      </div>

      {/* Backend status */}
      {backendOk === false && (
        <div
          style={{
            marginBottom: 20,
            padding: "10px 18px",
            background: "rgba(248,113,113,0.1)",
            border: "1px solid rgba(248,113,113,0.3)",
            borderRadius: 8,
            color: "#f87171",
            fontSize: 13,
            animation: "fadeIn 0.3s ease",
          }}
        >
          ⚠ Backend not reachable at https://medsynth-api.onrender.com — make sure Render service is live.
        </div>
      )}

      {/* Search box */}
      <div
        style={{
          width: "100%",
          maxWidth: 640,
          animation: "fadeUp 0.6s ease 0.1s both",
        }}
      >
        <div
          className="glass"
          style={{
            borderRadius: 14,
            padding: "4px 4px 4px 20px",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span style={{ color: "var(--muted)", fontSize: 18, flexShrink: 0 }}>
            ⌕
          </span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="Ask a medical question..."
            style={{
              flex: 1,
              background: "none",
              border: "none",
              outline: "none",
              color: "var(--text)",
              fontSize: 16,
              padding: "12px 0",
              fontFamily: "DM Sans",
            }}
          />
          <button
            className="btn-primary"
            onClick={() => handleSubmit()}
            disabled={!query.trim()}
            style={{
              padding: "12px 24px",
              fontSize: 14,
              opacity: query.trim() ? 1 : 0.4,
            }}
          >
            Analyze →
          </button>
        </div>

        {/* Example chips */}
        <div
          style={{
            marginTop: 16,
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <div
            style={{
              fontSize: 11,
              color: "var(--muted)",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              marginBottom: 4,
            }}
          >
            Example queries
          </div>
          {EXAMPLES.map((ex, i) => (
            <button
              key={i}
              onClick={() => handleSubmit(ex)}
              style={{
                background: "rgba(45,212,191,0.04)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                padding: "10px 16px",
                color: "var(--muted)",
                fontSize: 13,
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.2s",
                fontFamily: "DM Sans",
                animation: `fadeUp 0.4s ease ${0.2 + i * 0.07}s both`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--border2)";
                e.currentTarget.style.color = "var(--text)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.color = "var(--muted)";
              }}
            >
              {ex}
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          marginTop: 48,
          display: "flex",
          gap: 24,
          color: "var(--muted)",
          fontSize: 12,
          animation: "fadeIn 0.6s ease 0.5s both",
        }}
      >
        {[
          "6 AI Agents",
          "PubMed + ArXiv",
          "Evidence Scoring",
          "Contradiction Analysis",
        ].map((f) => (
          <span
            key={f}
            style={{ display: "flex", alignItems: "center", gap: 5 }}
          >
            <span style={{ color: "var(--teal)", fontSize: 8 }}>◆</span> {f}
          </span>
        ))}
      </div>
    </div>
  );
}
