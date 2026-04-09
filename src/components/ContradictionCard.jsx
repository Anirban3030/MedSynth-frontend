import EvidenceBar from "./EvidenceBar";

const TYPE_STYLES = {
  OUTCOME: {
    bg: "rgba(248,113,113,0.08)",
    border: "rgba(248,113,113,0.3)",
    color: "#f87171",
    label: "OUTCOME",
  },
  POPULATION: {
    bg: "rgba(96,165,250,0.08)",
    border: "rgba(96,165,250,0.3)",
    color: "#60a5fa",
    label: "POPULATION",
  },
  DOSAGE: {
    bg: "rgba(251,191,36,0.08)",
    border: "rgba(251,191,36,0.3)",
    color: "#fbbf24",
    label: "DOSAGE",
  },
  METHODOLOGY: {
    bg: "rgba(167,139,250,0.08)",
    border: "rgba(167,139,250,0.3)",
    color: "#a78bfa",
    label: "METHODOLOGY",
  },
};

function PaperSide({ title, year, journal, score, sample, finding, pubmedId }) {
  // Build PubMed link if we have a numeric ID
  // ArXiv papers have a URL as their ID already
  const link = pubmedId
    ? pubmedId.startsWith("http")
      ? pubmedId
      : `https://pubmed.ncbi.nlm.nih.gov/${pubmedId}/`
    : null;

  return (
    <div
      style={{
        background: "rgba(0,0,0,0.25)",
        borderRadius: 10,
        padding: "14px 16px",
      }}
    >
      {/* Title — clickable if link available */}
      <div
        style={{
          fontSize: 13,
          fontWeight: 600,
          marginBottom: 4,
          lineHeight: 1.4,
        }}
      >
        {link ? (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "var(--teal)", textDecoration: "none" }}
            onMouseOver={(e) => (e.target.style.textDecoration = "underline")}
            onMouseOut={(e) => (e.target.style.textDecoration = "none")}
          >
            {title || "Unknown Paper"}
          </a>
        ) : (
          <span style={{ color: "var(--text)" }}>
            {title || "Unknown Paper"}
          </span>
        )}
      </div>

      {/* Meta */}
      <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 10 }}>
        {year}
        {journal && ` · ${journal}`}
        {sample > 0 && ` · ${sample.toLocaleString()} patients`}
      </div>

      {/* Evidence bar */}
      {score != null && (
        <div style={{ marginBottom: 10 }}>
          <EvidenceBar score={score} />
        </div>
      )}

      {/* Finding */}
      <p style={{ fontSize: 13, color: "#cbd5e1", lineHeight: 1.6, margin: 0 }}>
        {finding || "—"}
      </p>
    </div>
  );
}

export default function ContradictionCard({ contradiction, index }) {
  const type = contradiction.type || "OUTCOME";
  const ts = TYPE_STYLES[type] || TYPE_STYLES.OUTCOME;

  return (
    <div
      style={{
        borderRadius: 12,
        border: `1px solid ${ts.border}`,
        background: ts.bg,
        padding: "20px 22px",
        animation: `fadeUp 0.4s ease ${index * 0.07}s both`,
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 16,
        }}
      >
        <span
          className="tag"
          style={{
            background: `${ts.color}22`,
            color: ts.color,
            border: `1px solid ${ts.color}44`,
          }}
        >
          {ts.label}
        </span>
        {contradiction.similarity != null && (
          <span
            style={{
              fontSize: 11,
              color: "var(--muted)",
              fontFamily: "JetBrains Mono",
            }}
          >
            Similarity: {(contradiction.similarity * 100).toFixed(0)}%
          </span>
        )}
      </div>

      {/* Two papers side by side — no arrow element in between */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 12,
          marginBottom: 14,
          position: "relative",
        }}
      >
        <PaperSide
          title={contradiction.paper_a_title}
          year={contradiction.paper_a_year}
          journal={contradiction.paper_a_journal}
          score={contradiction.paper_a_score}
          sample={contradiction.paper_a_sample}
          finding={contradiction.finding_a}
          pubmedId={contradiction.paper_a_id}
        />

        {/* Small VS divider — positioned absolutely in the centre gap */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: `${ts.color}22`,
            border: `1px solid ${ts.color}44`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: ts.color,
            fontSize: 10,
            fontWeight: 700,
            zIndex: 1,
          }}
        >
          VS
        </div>

        <PaperSide
          title={contradiction.paper_b_title}
          year={contradiction.paper_b_year}
          journal={contradiction.paper_b_journal}
          score={contradiction.paper_b_score}
          sample={contradiction.paper_b_sample}
          finding={contradiction.finding_b}
          pubmedId={contradiction.paper_b_id}
        />
      </div>

      {/* Why they disagree */}
      {contradiction.reason && (
        <div
          style={{
            background: "rgba(0,0,0,0.2)",
            borderRadius: 8,
            padding: "12px 14px",
            marginBottom: 10,
          }}
        >
          <div
            style={{
              fontSize: 10,
              color: ts.color,
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              marginBottom: 4,
            }}
          >
            Why they disagree
          </div>
          <p
            style={{
              fontSize: 13,
              color: "var(--text)",
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            {contradiction.reason}
          </p>
        </div>
      )}

      {/* Clinical significance — fixed field name from clinical_significance to clinical */}
      {contradiction.clinical && (
        <div
          style={{
            background: "rgba(0,0,0,0.2)",
            borderRadius: 8,
            padding: "12px 14px",
          }}
        >
          <div
            style={{
              fontSize: 10,
              color: "var(--amber)",
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              marginBottom: 4,
            }}
          >
            Clinical significance
          </div>
          <p
            style={{
              fontSize: 13,
              color: "var(--text)",
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            {contradiction.clinical}
          </p>
        </div>
      )}
    </div>
  );
}
