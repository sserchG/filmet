'use client'
import { useState, useEffect } from 'react'

export default function TrailerButton({ trailerKey }) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open])

  if (!trailerKey) return null

  return (
    <>
      {/* Button */}
      <button
        onClick={() => setOpen(true)}
        style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          padding: '0.6rem 1.2rem',
          background: 'transparent',
          border: '1px solid rgba(255,255,255,0.18)',
          borderRadius: '8px',
          color: 'var(--text)',
          fontSize: '0.82rem', fontWeight: 500,
          cursor: 'pointer',
          transition: 'background 0.2s, border-color 0.2s',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface2)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.28)' }}
        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)' }}
      >
        <span style={{ fontSize: '0.75rem' }}>▶</span>
        Ver trailer
      </button>

      {/* Modal */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 600,
            background: 'rgba(0,0,0,0.94)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '1.5rem',
            animation: 'fadeIn 0.2s ease',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{ position: 'relative', width: 'min(900px, 95vw)' }}
          >
            {/* Close */}
            <button
              onClick={() => setOpen(false)}
              style={{
                position: 'absolute', top: '-2.8rem', right: 0,
                background: 'transparent', border: 'none',
                color: 'var(--muted)', fontSize: '0.8rem',
                cursor: 'pointer', letterSpacing: '0.1em',
                display: 'flex', alignItems: 'center', gap: '0.4rem',
              }}
            >
              ✕ Cerrar (ESC)
            </button>

            {/* iframe wrapper — 16:9 */}
            <div style={{ position: 'relative', paddingTop: '56.25%', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 30px 80px rgba(0,0,0,0.8)' }}>
              <iframe
                src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&rel=0&modestbranding=1`}
                title="Trailer"
                allow="autoplay; fullscreen; picture-in-picture"
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
