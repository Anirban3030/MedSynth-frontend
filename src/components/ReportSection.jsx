export default function ReportSection({ title, children, accent = 'var(--teal)' }) {
  return (
    <div style={{
      background: 'var(--bg2)',
      border: '1px solid var(--border)',
      borderLeft: `3px solid ${accent}`,
      borderRadius: '0 12px 12px 0',
      padding: '20px 22px',
    }}>
      <div style={{
        fontSize: 11, fontWeight: 700, letterSpacing: '0.08em',
        textTransform: 'uppercase', color: accent, marginBottom: 12
      }}>
        {title}
      </div>
      {children}
    </div>
  )
}
