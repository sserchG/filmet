'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

// Lista básica de palabras a filtrar
const BANNED_WORDS = [
  'puta', 'puto', 'mierda', 'joder', 'coño', 'hostia', 'gilipollas',
  'idiota', 'imbécil', 'capullo', 'cabrón', 'cabron', 'hijo de puta',
  'fuck', 'shit', 'bitch', 'asshole', 'bastard', 'cunt',
]

function containsBannedWords(text) {
  const lower = text.toLowerCase()
  return BANNED_WORDS.some(word => lower.includes(word))
}

export default function Reviews({ movieId }) {
  const [reviews,  setReviews]  = useState([])
  const [user,     setUser]     = useState(null)
  const [username, setUsername] = useState('')
  const [content,  setContent]  = useState('')
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session?.user) return
      setUser(session.user)
      const meta = session.user.user_metadata
      // Cargar perfil, y crearlo si no existe
      const { data: profile } = await supabase
        .from('profiles').select('username').eq('id', session.user.id).single()
      if (profile?.username) {
        setUsername(profile.username)
      } else {
        // Crear perfil con username del metadata
        const fallbackUsername = meta?.username || meta?.name || 'Usuario'
        await supabase.from('profiles').upsert(
          { id: session.user.id, username: fallbackUsername },
          { onConflict: 'id' }
        )
        setUsername(fallbackUsername)
      }
    })
    loadReviews()
  }, [movieId])

  async function loadReviews() {
    // Cargamos reviews y username por separado para evitar problemas de FK
    const { data, error: err } = await supabase
      .from('reviews')
      .select('id, user_id, content, created_at, username')
      .eq('movie_id', Number(movieId))
      .order('created_at', { ascending: false })

    if (err) {
      console.error('Error cargando reviews:', err)
      return
    }
    setReviews(data || [])
  }

  async function submitReview() {
    if (!content.trim() || !user) return
    setError('')

    if (content.trim().length > 2000) {
      setError('El comentario no puede superar los 2000 caracteres.')
      return
    }

    if (containsBannedWords(content)) {
      setError('Tu comentario contiene palabras no permitidas. Por favor, revísalo.')
      return
    }

    setLoading(true)
    const { error: insertError } = await supabase.from('reviews').insert({
      user_id:  user.id,
      movie_id: Number(movieId),
      content:  content.trim(),
      username: username || 'Usuario',
    })

    if (insertError) {
      console.error('Error al publicar:', insertError)
      setError(`No se pudo publicar: ${insertError.message}`)
      setLoading(false)
      return
    }

    setContent('')
    await loadReviews()
    setLoading(false)
  }

  async function deleteReview(id) {
    await supabase.from('reviews').delete().eq('id', id)
    await loadReviews()
  }

  const charsLeft = 2000 - content.length

  return (
    <div style={{ marginTop: '3rem', borderTop: '1px solid var(--border)', paddingTop: '2rem' }}>
      <h3 style={{ fontSize: '0.75rem', color: 'var(--accent)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
        Comentarios ({reviews.length})
      </h3>

      {/* Formulario */}
      {user ? (
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ position: 'relative' }}>
            <textarea
              value={content}
              onChange={e => { setContent(e.target.value); setError('') }}
              placeholder="¿Qué te pareció esta película?"
              rows={3}
              maxLength={2000}
              style={{
                width: '100%',
                background: 'var(--surface)',
                border: `1px solid ${error ? 'rgba(224,92,92,0.5)' : 'var(--border)'}`,
                borderRadius: '10px',
                padding: '0.9rem 1rem',
                color: 'var(--text)',
                fontSize: '0.9rem',
                outline: 'none',
                resize: 'vertical',
                boxSizing: 'border-box',
                fontFamily: 'inherit',
              }}
            />
            <span style={{
              position: 'absolute', bottom: '0.5rem', right: '0.75rem',
              fontSize: '0.7rem', color: charsLeft < 100 ? '#e05c5c' : 'var(--muted)',
            }}>
              {charsLeft}
            </span>
          </div>

          {/* Error message */}
          {error && (
            <p style={{ color: '#e05c5c', fontSize: '0.82rem', marginTop: '0.4rem' }}>
              ⚠ {error}
            </p>
          )}

          <button
            onClick={submitReview}
            disabled={loading || !content.trim()}
            style={{
              marginTop: '0.75rem',
              background: 'var(--accent)',
              color: 'var(--bg)',
              border: 'none',
              borderRadius: '8px',
              padding: '0.65rem 1.4rem',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: loading || !content.trim() ? 'not-allowed' : 'pointer',
              opacity: !content.trim() ? 0.5 : 1,
              transition: 'opacity 0.2s',
            }}
          >
            {loading ? 'Publicando...' : 'Publicar comentario'}
          </button>
        </div>
      ) : (
        <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '2rem' }}>
          <a href="/login" style={{ color: 'var(--accent)' }}>Inicia sesión</a> para comentar
        </p>
      )}

      {/* Lista de comentarios */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {reviews.length === 0 ? (
          <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>Sé el primero en comentar esta película.</p>
        ) : (
          reviews.map((r) => (
            <div key={r.id} style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '10px',
              padding: '1rem 1.2rem',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{
                    width: '28px', height: '28px',
                    borderRadius: '50%',
                    background: 'var(--accent)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.7rem', fontWeight: 700,
                    color: 'var(--bg)',
                  }}>
                    {(r.username || '?').charAt(0).toUpperCase()}
                  </div>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{r.username || 'Usuario'}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
                    {new Date(r.created_at).toLocaleDateString('es-ES')}
                  </span>
                </div>
                {user?.id === r.user_id && (
                  <button onClick={() => deleteReview(r.id)} style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--muted)',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = '#e05c5c'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--muted)'}
                  >Eliminar</button>
                )}
              </div>
              <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>{r.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
