export default function EvidenceBar({ score }) {
  const pct = Math.round((score || 0) * 100)
  const color = score >= 0.7 ? '#34d399' : score >= 0.5 ? '#fbbf24' : '#f87171'
  const label = score >= 0.7 ? 'High' : score >= 0.5 ? 'Moderate' : 'Low'

  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Evidence Quality
        </span>
        <span style={{ fontSize: 11, fontFamily: 'JetBrains Mono', color, fontWeight: 600 }}>
          {label} · {score?.toFixed(2)}
        </span>
      </div>
      <div style={{
        height: 6,
        background: 'rgba(255,255,255,0.07)',
        borderRadius: 3,
        overflow: 'hidden'
      }}>
        <div style={{
          height: '100%',
          width: `${pct}%`,
          background: color,
          borderRadius: 3,
          transition: 'width 1s ease',
          boxShadow: `0 0 8px ${color}66`
        }} />
      </div>
    </div>
  )
}
