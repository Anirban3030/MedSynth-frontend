import { useState } from "react";
import EvidenceBar from "./EvidenceBar";

export default function PaperCard({ paper, index }) {
  const [expanded, setExpanded] = useState(false);
  const f = paper.facts || {};

  const studyColor =
    {
      "Meta-Analysis": "var(--teal)",
      "Randomized Controlled Trial": "var(--blue)",
      Review: "var(--purple)",
      "Observational Study": "var(--amber)",
    }[f.study_type] || "var(--muted)";

  return (
    <div
      className="card"
      style={{
        padding: "20px 22px",
        animation: `fadeUp 0.4s ease ${index * 0.05}s both`,
      }}
    >
      {/* Top row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 12,
          marginBottom: 12,
        }}
      >
        <div style={{ flex: 1 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 6,
              flexWrap: "wrap",
            }}
          >
            {f.study_type && (
              <span
                className="tag"
                style={{
                  background: `${studyColor}18`,
                  color: studyColor,
                  border: `1px solid ${studyColor}33`,
                }}
              >
                {f.study_type}
              </span>
            )}
            {paper.relevance_score > 0 && (
              <span
                className="tag"
                style={{
                  background: "rgba(167,139,250,0.1)",
                  color: "var(--purple)",
                  border: "1px solid rgba(167,139,250,0.2)",
                }}
              >
                Relevance {paper.relevance_score}/10
              </span>
            )}
          </div>
          <h3
            style={{
              fontSize: 15,
              fontWeight: 600,
              color: "var(--text)",
              margin: 0,
              lineHeight: 1.4,
            }}
          >
            {paper.id && !paper.id.startsWith("http") ? (
              <a
                href={`https://pubmed.ncbi.nlm.nih.gov/${paper.id}/`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "var(--text)", textDecoration: "none" }}
                onMouseOver={(e) =>
                  (e.target.style.textDecoration = "underline")
                }
                onMouseOut={(e) => (e.target.style.textDecoration = "none")}
              >
                {paper.title}
              </a>
            ) : paper.id && paper.id.startsWith("http") ? (
              <a
                href={paper.id}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "var(--text)", textDecoration: "none" }}
                onMouseOver={(e) =>
                  (e.target.style.textDecoration = "underline")
                }
                onMouseOut={(e) => (e.target.style.textDecoration = "none")}
              >
                {paper.title}
              </a>
            ) : (
              paper.title
            )}
          </h3>
          <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>
            {paper.journal && <span>{paper.journal}</span>}
            {paper.journal && paper.year && (
              <span style={{ margin: "0 6px", opacity: 0.4 }}>·</span>
            )}
            {paper.year && <span>{paper.year}</span>}
            {paper.sample_size > 0 && (
              <>
                <span style={{ margin: "0 6px", opacity: 0.4 }}>·</span>
                <span>{paper.sample_size.toLocaleString()} patients</span>
              </>
            )}
          </div>
        </div>
        <div
          style={{
            fontFamily: "JetBrains Mono",
            fontSize: 22,
            fontWeight: 700,
            color:
              paper.evidence_score >= 0.7
                ? "var(--green)"
                : paper.evidence_score >= 0.5
                ? "var(--amber)"
                : "var(--red)",
            flexShrink: 0,
          }}
        >
          {paper.evidence_score?.toFixed(2)}
        </div>
      </div>

      {/* Evidence bar */}
      <div style={{ marginBottom: 12 }}>
        <EvidenceBar score={paper.evidence_score} />
      </div>

      {/* Summary */}
      {paper.summary && (
        <p
          style={{
            fontSize: 13,
            color: "var(--muted)",
            lineHeight: 1.7,
            margin: "0 0 12px",
          }}
        >
          {paper.summary}
        </p>
      )}

      {/* Expand */}
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          fontSize: 12,
          color: "var(--teal)",
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 0,
          fontWeight: 600,
        }}
      >
        {expanded ? "▲ Show less" : "▼ Show details"}
      </button>

      {expanded && (
        <div
          style={{
            marginTop: 14,
            paddingTop: 14,
            borderTop: "1px solid var(--border)",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 10,
          }}
        >
          {[
            ["Location", f.location],
            ["Key Statistic", f.key_statistic],
            [
              "Drugs Mentioned",
              Array.isArray(f.drugs) ? f.drugs.join(", ") : f.drugs,
            ],
            ["Conclusion", f.conclusion],
          ]
            .filter(([, v]) => v)
            .map(([label, val]) => (
              <div
                key={label}
                style={{
                  background: "rgba(0,0,0,0.2)",
                  borderRadius: 8,
                  padding: "10px 12px",
                }}
              >
                <div
                  style={{
                    fontSize: 10,
                    color: "var(--teal)",
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    marginBottom: 4,
                  }}
                >
                  {label}
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: "var(--text)",
                    lineHeight: 1.5,
                  }}
                >
                  {val}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
