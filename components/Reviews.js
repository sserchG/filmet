'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Reviews({ movieId }) {
  const [reviews, setReviews] = useState([])
  const [user, setUser] = useState(null)
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })
    loadReviews()
  }, [])

  async function loadReviews() {
    const { data } = await supabase
      .from('reviews')
      .select('*, profiles(username)')
      .eq('movie_id', movieId)
      .order('created_at', { ascending: false })
    setReviews(data || [])
  }

  async function submitReview() {
    if (!content.trim() || !user) return
    if (content.trim().length > 2000) {
      alert('El comentario no puede superar los 2000 caracteres.')
      return
    }
    setLoading(true)
    await supabase.from('reviews').insert({
      user_id: user.id,
      movie_id: movieId,
      content: content.trim(),
    })
    setContent('')
    await loadReviews()
    setLoading(false)
  }

  async function deleteReview(id) {
    await supabase.from('reviews').delete().eq('id', id)
    await loadReviews()
  }

  return (
    <div style={{ marginTop: '3rem', borderTop: '1px solid var(--border)', paddingTop: '2rem' }}>
      <h3 style={{ fontSize: '0.75rem', color: 'var(--accent)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
        Comentarios ({reviews.length})
      </h3>

      {/* Formulario */}
      {user ? (
        <div style={{ marginBottom: '2rem' }}>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="¿Qué te pareció esta película?"
            rows={3}
            maxLength={2000}
            style={{
              width: '100%',
              background: 'var(--surface)',
              border: '1px solid var(--border)',
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
          <button onClick={submitReview} disabled={loading || !content.trim()} style={{
            marginTop: '0.75rem',
            background: 'var(--accent)',
            color: 'var(--bg)',
            border: 'none',
            borderRadius: '8px',
            padding: '0.65rem 1.4rem',
            fontSize: '0.85rem',
            fontWeight: 600,
            cursor: 'pointer',
            opacity: !content.trim() ? 0.5 : 1,
          }}>
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
                    {r.profiles?.username?.charAt(0).toUpperCase()}
                  </div>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{r.profiles?.username}</span>
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
                  }}>Eliminar</button>
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