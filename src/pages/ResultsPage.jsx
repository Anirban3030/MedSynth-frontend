import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PaperCard from '../components/PaperCard'
import ContradictionCard from '../components/ContradictionCard'
import ReportSection from '../components/ReportSection'

const CONF_STYLES = {
  HIGH:     { bg: 'rgba(52,211,153,0.1)',  border: 'rgba(52,211,153,0.4)',  color: '#34d399', label: 'HIGH CONFIDENCE' },
  MODERATE: { bg: 'rgba(251,191,36,0.1)',  border: 'rgba(251,191,36,0.4)',  color: '#fbbf24', label: 'MODERATE CONFIDENCE' },
  LOW:      { bg: 'rgba(248,113,113,0.1)', border: 'rgba(248,113,113,0.4)', color: '#f87171', label: 'LOW CONFIDENCE' },
}

export default function ResultsPage() {
  const navigate = useNavigate()
  const [data, setData]   = useState(null)
  const [tab, setTab]     = useState('papers') // papers | contradictions

  useEffect(() => {
    const raw = sessionStorage.getItem('ms_results')
    if (!raw) { navigate('/'); return }
    try { setData(JSON.parse(raw)) } catch { navigate('/') }
  }, [])

  if (!data) return null

  const { query, papers = [], contradictions = [], report = {}, report_text } = data
  const conf = CONF_STYLES[report.confidence] || CONF_STYLES.MODERATE
  const sortedPapers = [...papers].sort((a, b) => (b.evidence_score || 0) - (a.evidence_score || 0))

  const downloadReport = () => {
    const blob = new Blob([report_text || 'No report available'], { type: 'text/plain' })
    const url  = URL.createObjectURL(blob)
    const a    = Object.assign(document.createElement('a'), { href: url, download: 'medsynth_report.txt' })
    a.click(); URL.revokeObjectURL(url)
  }

  return (
    <div className="grid-bg" style={{ minHeight: '100vh', padding: '0 0 60px' }}>

      {/* Top nav */}
      <div className="glass" style={{ position: 'sticky', top: 0, zIndex: 50, borderBottom: '1px solid var(--border)', borderRadius: 0 }}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '12px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
          <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--teal)', fontSize: 14, fontWeight: 600, padding: 0 }}>
            ← New Search
          </button>
          <div style={{ flex: 1, fontSize: 13, color: 'var(--muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            "{query}"
          </div>
          <button className="btn-primary" onClick={downloadReport} style={{ padding: '8px 16px', fontSize: 13 }}>
            ↓ Download Report
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 24px' }}>

        {/* Verdict banner */}
        <div style={{
          borderRadius: 14, padding: '24px 28px', marginBottom: 24,
          background: `linear-gradient(135deg, ${conf.bg}, rgba(0,0,0,0.3))`,
          border: `1px solid ${conf.border}`,
          animation: 'fadeUp 0.5s ease both'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 10, color: conf.color, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>
                Verdict
              </div>
              <p style={{ fontSize: 16, color: 'var(--text)', lineHeight: 1.7, margin: 0 }}>
                {report.verdict || 'Analysis complete. See papers below for details.'}
              </p>
            </div>
            <span className="tag" style={{ background: conf.bg, color: conf.color, border: `1px solid ${conf.border}`, flexShrink: 0 }}>
              {conf.label}
            </span>
          </div>
        </div>

        {/* Stats strip */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 24, animation: 'fadeUp 0.5s ease 0.1s both' }}>
          {[
            ['Papers Analysed', papers.length],
            ['Total Patients', report.total_patients ? report.total_patients.toLocaleString() : '—'],
            ['Study Period', report.year_range || '—'],
            ['Contradictions', contradictions.length],
          ].map(([label, value]) => (
            <div key={label} className="card" style={{ padding: '14px 16px', textAlign: 'center' }}>
              <div style={{ fontFamily: 'JetBrains Mono', fontSize: 22, fontWeight: 700, color: 'var(--teal)', marginBottom: 4 }}>{value}</div>
              <div style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Consensus */}
        {Array.isArray(report.consensus) && report.consensus.length > 0 && (
          <div style={{ marginBottom: 20, animation: 'fadeUp 0.5s ease 0.15s both' }}>
            <ReportSection title="What most papers agree on" accent="var(--teal)">
              <ul style={{ margin: 0, padding: '0 0 0 16px' }}>
                {report.consensus.map((item, i) => (
                  <li key={i} style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.7, marginBottom: 4 }}>{item}</li>
                ))}
              </ul>
            </ReportSection>
          </div>
        )}

        {/* Disagreements */}
        {report.disagreements && (
          <div style={{ marginBottom: 20, animation: 'fadeUp 0.5s ease 0.2s both' }}>
            <ReportSection title="Areas of disagreement" accent="var(--amber)">
              <p style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.7, margin: 0 }}>{report.disagreements}</p>
            </ReportSection>
          </div>
        )}

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 16, animation: 'fadeUp 0.5s ease 0.25s both' }}>
          {[
            ['papers', `Papers (${papers.length})`],
            ['contradictions', `Contradictions (${contradictions.length})`],
          ].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              style={{
                padding: '8px 18px', borderRadius: 8, border: '1px solid',
                borderColor: tab === key ? 'var(--teal)' : 'var(--border)',
                background: tab === key ? 'rgba(45,212,191,0.1)' : 'transparent',
                color: tab === key ? 'var(--teal)' : 'var(--muted)',
                fontSize: 13, fontWeight: 600, cursor: 'pointer',
                fontFamily: 'DM Sans', transition: 'all 0.2s'
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Papers tab */}
        {tab === 'papers' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {sortedPapers.length === 0
              ? <div className="card" style={{ padding: 32, textAlign: 'center', color: 'var(--muted)' }}>No papers found</div>
              : sortedPapers.map((p, i) => <PaperCard key={i} paper={p} index={i} />)
            }
          </div>
        )}

        {/* Contradictions tab */}
        {tab === 'contradictions' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {contradictions.length === 0
              ? <div className="card" style={{ padding: 32, textAlign: 'center', color: 'var(--muted)' }}>No contradictions detected between papers</div>
              : contradictions.map((c, i) => <ContradictionCard key={i} contradiction={c} index={i} />)
            }
          </div>
        )}

        {/* Clinical implications */}
        {report.implications && (
          <div style={{ marginTop: 24, animation: 'fadeUp 0.5s ease 0.3s both' }}>
            <ReportSection title="Clinical implications" accent="var(--blue)">
              <p style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.7, margin: 0 }}>{report.implications}</p>
            </ReportSection>
          </div>
        )}

        {/* Disclaimer */}
        <div style={{
          marginTop: 24,
          borderRadius: 10,
          border: '1px solid var(--border)',
          background: 'rgba(148,163,184,0.05)',
          padding: '16px 20px',
          animation: 'fadeUp 0.5s ease 0.35s both'
        }}>
          <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 6 }}>
            Disclaimer
          </div>
          <p style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.7, margin: 0 }}>
            MedSynth is a research assistance tool only. Results are limited to {papers.length} papers and do not constitute a comprehensive systematic review. This tool should never be the sole basis for clinical or medical decisions. Always consult qualified medical professionals and refer to current clinical guidelines.
          </p>
        </div>
      </div>
    </div>
  )
}
