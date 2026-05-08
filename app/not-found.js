import Link from 'next/link'

export default function NotFound() {
  return (
    <main style={{
      minHeight: '100vh',
      background: 'var(--bg)', color: 'var(--text)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      textAlign: 'center', padding: '2rem',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Giant 404 watermark */}
      <div className="font-display" style={{
        position: 'absolute',
        fontSize: 'clamp(14rem, 35vw, 28rem)',
        color: 'var(--accent)', opacity: 0.04,
        lineHeight: 1, userSelect: 'none',
        pointerEvents: 'none',
      }}>404</div>

      <p style={{ fontSize: '0.65rem', color: 'var(--accent)', letterSpacing: '0.38em', textTransform: 'uppercase', marginBottom: '1rem' }}>
        Error 404
      </p>

      <h1 className="font-display" style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', lineHeight: 0.9, marginBottom: '1.5rem' }}>
        Película no<br />encontrada
      </h1>

      <p style={{ color: 'var(--muted)', fontSize: '0.95rem', lineHeight: 1.8, marginBottom: '3rem', maxWidth: '380px' }}>
        Esta página no existe en nuestra base de datos… o quizás nunca se rodó.
      </p>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link href="/" style={{
          background: 'var(--accent)', color: 'var(--bg)',
          padding: '0.8rem 2rem', borderRadius: '6px',
          fontSize: '0.78rem', fontWeight: 700,
          textDecoration: 'none', letterSpacing: '0.1em', textTransform: 'uppercase',
        }}>
          Volver al inicio
        </Link>
        <Link href="/buscar" style={{
          background: 'transparent', color: 'var(--muted)',
          padding: '0.8rem 2rem', borderRadius: '6px',
          fontSize: '0.78rem', fontWeight: 500,
          textDecoration: 'none', letterSpacing: '0.08em',
          border: '1px solid var(--border)',
        }}>
          Buscar película
        </Link>
      </div>
    </main>
  )
}
