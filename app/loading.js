export default function Loading() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{ textAlign: 'center' }}>
        <div className="font-display" style={{
          fontSize: '2.5rem', color: 'var(--accent)',
          letterSpacing: '0.18em', opacity: 0.5,
          animation: 'glowPulse 1.4s ease infinite',
        }}>
          FILMET
        </div>
        <div style={{
          width: '40px', height: '1px',
          background: 'var(--accent)', opacity: 0.4,
          margin: '0.6rem auto 0',
          animation: 'shimmer 1.4s ease infinite',
        }} />
      </div>
    </div>
  )
}
