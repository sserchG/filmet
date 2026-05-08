'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function MovieActions({ movie }) {
  const router = useRouter()
  const [user, setUser]           = useState(null)
  const [status, setStatus]       = useState(null)
  const [rating, setRating]       = useState(null)
  const [showRating, setShowRating] = useState(false)
  const [loading, setLoading]     = useState(false)
  const [hoverRating, setHoverRating] = useState(null)
  const [feedback, setFeedback]   = useState('')

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session?.user) return
      setUser(session.user)
      // Asegurar que el perfil existe (evita FK violations)
      const { data: profile } = await supabase
        .from('profiles').select('id').eq('id', session.user.id).single()
      if (!profile) {
        const meta = session.user.user_metadata
        await supabase.from('profiles').upsert(
          { id: session.user.id, username: meta?.username || meta?.name || 'Usuario' },
          { onConflict: 'id' }
        )
      }
      loadUserMovie(session.user.id)
    })
  }, [])

  async function loadUserMovie(userId) {
    const { data } = await supabase
      .from('user_movies').select('status, rating')
      .eq('user_id', userId).eq('movie_id', movie.id).single()
    if (data) { setStatus(data.status); setRating(data.rating) }
  }

  async function upsertMovie() {
    return supabase.from('movies').upsert({
      id: movie.id, title: movie.title,
      poster_path: movie.poster_path, backdrop_path: movie.backdrop_path,
      overview: movie.overview, release_date: movie.release_date,
      vote_average: movie.vote_average,
    })
  }

  async function saveMovie(newStatus) {
    if (!user) return router.push('/login')
    setLoading(true)
    setFeedback('')

    const { error: movieErr } = await upsertMovie()
    if (movieErr) {
      console.error('Error guardando película:', movieErr)
      setFeedback('Error al guardar. ¿Has confirmado tu email?')
      setLoading(false)
      return
    }

    if (status === newStatus) {
      const { error } = await supabase.from('user_movies').delete()
        .eq('user_id', user.id).eq('movie_id', movie.id)
      if (!error) setStatus(null)
    } else {
      const { error } = await supabase.from('user_movies').upsert({
        user_id: user.id, movie_id: movie.id,
        status: newStatus, rating,
      })
      if (error) {
        console.error('Error en user_movies:', error)
        setFeedback('Error al guardar el estado.')
      } else {
        setStatus(newStatus)
      }
    }
    setLoading(false)
  }

  async function saveRating(stars) {
    if (!user) return router.push('/login')
    setLoading(true)
    setFeedback('')

    const { error: movieErr } = await upsertMovie()
    if (movieErr) {
      setFeedback('Error al guardar. ¿Has confirmado tu email?')
      setLoading(false)
      return
    }

    const { error } = await supabase.from('user_movies').upsert({
      user_id: user.id, movie_id: movie.id,
      status: status || 'watched', rating: stars,
    })
    if (error) {
      setFeedback('Error al guardar la puntuación.')
    } else {
      setRating(stars)
      setStatus(prev => prev || 'watched')
      setShowRating(false)
    }
    setLoading(false)
  }

  const actions = [
    {
      key: 'watchlist',
      icon: status === 'watchlist' ? '✓' : '+',
      label: status === 'watchlist' ? 'En mi lista' : 'Mi lista',
      active: status === 'watchlist',
      color: 'var(--accent)',
    },
    {
      key: 'favorite',
      icon: '♥',
      label: status === 'favorite' ? 'Favorita' : 'Favorita',
      active: status === 'favorite',
      color: '#e05c5c',
    },
    {
      key: 'watched',
      icon: status === 'watched' ? '◉' : '○',
      label: status === 'watched' ? 'Vista' : 'Marcar vista',
      active: status === 'watched',
      color: '#5ce07a',
    },
  ]

  return (
    <div>
      {/* Action buttons */}
      <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginBottom: showRating ? '1.2rem' : 0 }}>
        {actions.map(a => (
          <ActionBtn
            key={a.key}
            icon={a.icon}
            label={a.label}
            active={a.active}
            color={a.color}
            disabled={loading}
            onClick={() => saveMovie(a.key)}
          />
        ))}

        {/* Rating button */}
        <ActionBtn
          icon="★"
          label={rating ? `${rating}/10` : 'Puntuar'}
          active={!!rating}
          color="var(--accent)"
          disabled={loading}
          onClick={() => setShowRating(v => !v)}
        />
      </div>

      {/* Feedback error */}
      {feedback && (
        <p style={{ color: '#e05c5c', fontSize: '0.78rem', marginTop: '0.6rem' }}>
          ⚠ {feedback}
        </p>
      )}

      {/* Rating panel */}
      {showRating && (
        <div style={{
          marginTop: '1rem',
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: '12px',
          padding: '1rem 1.2rem',
          animation: 'fadeUp 0.2s ease',
        }}>
          <p style={{ fontSize: '0.7rem', color: 'var(--muted)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
            Tu puntuación
          </p>
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            {[1,2,3,4,5,6,7,8,9,10].map(n => {
              const filled = (hoverRating ?? rating ?? 0) >= n
              return (
                <button
                  key={n}
                  onClick={() => saveRating(n)}
                  onMouseEnter={() => setHoverRating(n)}
                  onMouseLeave={() => setHoverRating(null)}
                  style={{
                    width: '34px', height: '34px',
                    borderRadius: '6px',
                    background: filled ? 'rgba(201,168,76,0.15)' : 'var(--surface2)',
                    color: filled ? 'var(--accent)' : 'var(--muted)',
                    border: `1px solid ${filled ? 'rgba(201,168,76,0.4)' : 'var(--border)'}`,
                    fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >{n}</button>
              )
            })}
          </div>
          {rating && (
            <button
              onClick={() => { setRating(null); saveRating(null) }}
              style={{
                marginTop: '0.6rem', background: 'none', border: 'none',
                color: 'var(--muted)', fontSize: '0.72rem', cursor: 'pointer',
                letterSpacing: '0.05em',
              }}
            >Quitar puntuación</button>
          )}
        </div>
      )}
    </div>
  )
}

function ActionBtn({ icon, label, active, color, disabled, onClick }) {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: '0.45rem',
        padding: '0.6rem 1.2rem',
        borderRadius: '8px',
        border: `1px solid ${active ? color : hovered ? 'rgba(255,255,255,0.15)' : 'var(--border)'}`,
        background: active
          ? `${color}18`
          : hovered ? 'var(--surface2)' : 'transparent',
        color: active ? color : hovered ? 'var(--text)' : 'var(--muted)',
        fontSize: '0.82rem', fontWeight: active ? 600 : 500,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        transition: 'all 0.18s ease',
        whiteSpace: 'nowrap',
      }}
    >
      <span>{icon}</span>
      {label}
    </button>
  )
}
