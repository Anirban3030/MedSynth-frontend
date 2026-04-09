import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import AgentCard from "../components/AgentCard";

const AGENTS = [
  {
    number: 1,
    name: "Query Decomposer",
    description: "Converting your question to MeSH terms and sub-queries",
  },
  {
    number: 2,
    name: "Paper Fetcher",
    description: "Searching PubMed and ArXiv, filtering for relevance",
  },
  {
    number: 3,
    name: "Summarizer",
    description: "Reading abstracts and extracting structured facts",
  },
  {
    number: 4,
    name: "Contradiction Detector",
    description: "Finding related paper pairs and analysing disagreements",
  },
  {
    number: 5,
    name: "Evidence Scorer",
    description:
      "Scoring each paper by study type, journal, recency, sample size",
  },
  {
    number: 6,
    name: "Report Generator",
    description: "Writing structured literature review with verdict",
  },
];

export default function PipelinePage() {
  const navigate = useNavigate();
  const [states, setStates] = useState(Array(6).fill("waiting"));
  const [error, setError] = useState(null);
  const [currentIdx, setCurrentIdx] = useState(-1);

  const query = sessionStorage.getItem("ms_query") || "";

  useEffect(() => {
    if (!query) {
      navigate("/");
      return;
    }

    // Agent index map — backend sends agent number 1-6
    // we store state as array index 0-5
    const updateAgent = (agentNumber, status, message) => {
      const idx = agentNumber - 1;
      setCurrentIdx(idx);
      setStates((prev) => {
        const s = [...prev];
        s[idx] = status;
        return s;
      });
    };

    // Connect to the real-time stream
    const url = `https://medsynth-api.onrender.com/analyze/stream?query=${encodeURIComponent(
      query
    )}&max_results=15`;
    const eventSource = new EventSource(url);

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "complete") {
        // Mark all agents done
        setStates(Array(6).fill("done"));
        eventSource.close();
        // Store result and navigate
        sessionStorage.setItem("ms_results", JSON.stringify(data));
        setTimeout(() => navigate("/results"), 600);
      } else if (data.type === "error") {
        setError(data.message);
        eventSource.close();
      } else if (data.agent && data.status) {
        updateAgent(data.agent, data.status, data.message);
      }
    };

    eventSource.onerror = () => {
      setError("Connection lost. Please try again.");
      eventSource.close();
    };

    // Cleanup if user navigates away
    return () => eventSource.close();
  }, []);

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
      <div style={{ width: "100%", maxWidth: 560 }}>
        {/* Header */}
        <div
          style={{
            textAlign: "center",
            marginBottom: 32,
            animation: "fadeUp 0.4s ease both",
          }}
        >
          <div
            style={{
              fontFamily: "DM Serif Display",
              fontSize: 28,
              marginBottom: 8,
              background: "linear-gradient(135deg, var(--teal), var(--blue))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Analysing Literature
          </div>
          <div
            style={{
              fontSize: 13,
              color: "var(--muted)",
              maxWidth: 380,
              margin: "0 auto",
              lineHeight: 1.6,
            }}
          >
            "{query}"
          </div>
        </div>

        {/* Agent cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {AGENTS.map((agent, i) => (
            <div
              key={agent.number}
              style={{ animation: `fadeUp 0.3s ease ${i * 0.05}s both` }}
            >
              <AgentCard
                number={agent.number}
                name={agent.name}
                description={agent.description}
                state={states[i]}
                error={i === currentIdx ? error : null}
              />
              {i < AGENTS.length - 1 && (
                <div
                  style={{
                    width: 1,
                    height: 8,
                    background: "var(--border)",
                    margin: "0 auto",
                    marginLeft: 39,
                  }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Progress text */}
        <div
          style={{
            marginTop: 24,
            textAlign: "center",
            fontSize: 12,
            color: "var(--muted)",
          }}
        >
          {states.filter((s) => s === "done").length} of 6 agents complete
        </div>
      </div>
    </div>
  );
}
