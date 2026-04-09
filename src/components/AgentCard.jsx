const ICONS = {
  1: '◈', 2: '⬡', 3: '◉', 4: '⟁', 5: '◎', 6: '▣'
}

const STATE_STYLES = {
  waiting:    { border: 'rgba(148,163,184,0.2)',  icon: 'var(--muted)',  bg: 'rgba(148,163,184,0.05)', label: 'Waiting'    },
  processing: { border: 'rgba(96,165,250,0.6)',   icon: 'var(--blue)',   bg: 'rgba(96,165,250,0.08)',  label: 'Running'    },
  done:       { border: 'rgba(52,211,153,0.5)',   icon: 'var(--green)',  bg: 'rgba(52,211,153,0.06)',  label: 'Complete'   },
  error:      { border: 'rgba(248,113,113,0.5)',  icon: 'var(--red)',    bg: 'rgba(248,113,113,0.06)', label: 'Failed'     },
}

export default function AgentCard({ number, name, description, state = 'waiting', error }) {
  const s = STATE_STYLES[state] || STATE_STYLES.waiting

  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: 16,
      padding: '16px 20px',
      borderRadius: 12,
      border: `1px solid ${s.border}`,
      background: s.bg,
      transition: 'all 0.4s ease',
      animation: state === 'done' ? 'fadeIn 0.3s ease' : 'none'
    }}>
      {/* Icon / Spinner */}
      <div style={{
        width: 40, height: 40,
        borderRadius: 10,
        border: `1px solid ${s.border}`,
        background: 'rgba(0,0,0,0.3)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
        fontSize: 18,
        color: s.icon,
        ...(state === 'processing' ? { animation: 'pulse-ring 1.5s infinite' } : {})
      }}>
        {state === 'processing'
          ? <div style={{ width: 18, height: 18, border: `2px solid var(--blue)`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          : state === 'done'
          ? <span style={{ color: 'var(--green)', fontSize: 18 }}>✓</span>
          : state === 'error'
          ? <span style={{ color: 'var(--red)', fontSize: 18 }}>✕</span>
          : <span style={{ fontFamily: 'JetBrains Mono', fontSize: 14, opacity: 0.5 }}>{ICONS[number]}</span>
        }
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 3 }}>
          <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: 'var(--muted)', opacity: 0.7 }}>
            AGENT {number}
          </span>
          <span style={{
            fontSize: 10,
            padding: '1px 8px',
            borderRadius: 20,
            border: `1px solid ${s.border}`,
            color: s.icon,
            fontWeight: 600,
            letterSpacing: '0.06em',
            textTransform: 'uppercase'
          }}>
            {s.label}
          </span>
        </div>
        <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', marginBottom: 2 }}>{name}</div>
        <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.5 }}>{description}</div>
        {error && <div style={{ marginTop: 6, fontSize: 12, color: 'var(--red)' }}>{error}</div>}
      </div>
    </div>
  )
}
