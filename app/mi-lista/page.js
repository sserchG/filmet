'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import Image from 'next/image'

const FILTERS = [
  { value: 'all',       label: 'Todo',       icon: '◈' },
  { value: 'watchlist', label: 'Pendientes',  icon: '◷' },
  { value: 'favorite',  label: 'Favoritas',   icon: '♥' },
  { value: 'watched',   label: 'Vistas',      icon: '✓' },
]

const STATUS_META = {
  watchlist: { text: 'Pendiente', color: 'var(--accent)',  bg: 'rgba(201,168,76,0.12)' },
  favorite:  { text: 'Favorita',  color: '#e05c5c',        bg: 'rgba(224,92,92,0.12)'  },
  watched:   { text: 'Vista',     color: '#5ce07a',        bg: 'rgba(92,224,122,0.12)' },
}

const NEXT_STATUS = { watchlist: 'watched', favorite: 'watched', watched: 'watchlist' }
const NEXT_LABEL  = { watchlist: 'Marcar vista', favorite: 'Marcar vista', watched: 'Mover a lista' }

export default function MiLista() {
  const [movies,  setMovies]  = useState([])
  const [loading, setLoading] = useState(true)
  const [filter,  setFilter]  = useState('all')
  const [user,    setUser]    = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) { setUser(session.user); loadMovies(session.user.id) }
      else setLoading(false)
    })
  }, [])

  async function loadMovies(userId) {
    const { data } = await supabase
      .from('user_movies').select('*, movies(*)')
      .eq('user_id', userId).order('created_at', { ascending: false })
    setMovies(data || [])
    setLoading(false)
  }

  async function changeStatus(item, newStatus) {
    await supabase.from('user_movies')
      .update({ status: newStatus })
      .eq('user_id', user.id).eq('movie_id', item.movies.id)
    setMovies(prev => prev.map(m => m.id === item.id ? { ...m, status: newStatus } : m))
  }

  async function removeMovie(item) {
    await supabase.from('user_movies')
      .delete().eq('user_id', user.id).eq('movie_id', item.movies.id)
    setMovies(prev => prev.filter(m => m.id !== item.id))
  }

  const counts = {
    all:       movies.length,
    watchlist: movies.filter(m => m.status === 'watchlist').length,
    favorite:  movies.filter(m => m.status === 'favorite').length,
    watched:   movies.filter(m => m.status === 'watched').length,
  }
  const filtered = filter === 'all' ? movies : movies.filter(m => m.status === filter)
  const avgRating = (() => {
    const rated = movies.filter(m => m.rating)
    return rated.length ? (rated.reduce((s, m) => s + m.rating, 0) / rated.length).toFixed(1) : null
  })()

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)' }}>
      <section style={{ padding: '5rem 2.5rem 6rem', maxWidth: '1200px', margin: '0 auto' }}>

        <p style={{ fontSize: '0.65rem', color: 'var(--accent)', letterSpacing: '0.32em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
          Tu colección
        </p>
        <h1 className="font-display" style={{ fontSize: '3.5rem', lineHeight: 1, marginBottom: '2.5rem' }}>
          Mi lista
        </h1>

        {/* ── Sin sesión ── */}
        {!user ? (
          <div style={{ textAlign: 'center', padding: '6rem 0' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>🎬</div>
            <p style={{ color: 'var(--text)', fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>
              Inicia sesión para ver tu lista
            </p>
            <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '2rem' }}>
              Guarda películas, marca favoritas y lleva el control de lo que has visto
            </p>
            <Link href="/login" style={{
              background: 'var(--accent)', color: 'var(--bg)',
              padding: '0.85rem 2.2rem', borderRadius: '8px',
              textDecoration: 'none', fontWeight: 700, fontSize: '0.85rem',
              letterSpacing: '0.08em', textTransform: 'uppercase',
            }}>Entrar</Link>
          </div>

        /* ── Cargando ── */
        ) : loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1.5rem' }}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} style={{
                aspectRatio: '2/3', borderRadius: '10px',
                background: 'var(--surface)',
                animation: 'shimmer 1.4s ease infinite',
                backgroundImage: 'linear-gradient(90deg, var(--surface) 25%, var(--surface2) 50%, var(--surface) 75%)',
                backgroundSize: '400px 100%',
              }}/>
            ))}
          </div>

        /* ── Lista vacía ── */
        ) : movies.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '6rem 0' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>📽️</div>
            <p style={{ color: 'var(--text)', fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>
              Tu lista está vacía
            </p>
            <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '2rem' }}>
              Añade películas desde la cartelera o el buscador
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <Link href="/cartelera" style={{
                background: 'var(--accent)', color: 'var(--bg)', padding: '0.75rem 1.8rem',
                borderRadius: '8px', textDecoration: 'none', fontWeight: 700,
                fontSize: '0.82rem', letterSpacing: '0.08em', textTransform: 'uppercase',
              }}>Cartelera</Link>
              <Link href="/buscar" style={{
                background: 'transparent', color: 'var(--muted)', border: '1px solid var(--border)',
                padding: '0.75rem 1.8rem', borderRadius: '8px', textDecoration: 'none',
                fontSize: '0.82rem', letterSpacing: '0.08em', textTransform: 'uppercase',
              }}>Buscar</Link>
            </div>
          </div>

        ) : (
          <>
            {/* ── Stats ── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.65rem', marginBottom: '2.5rem' }}>
              {[
                { label: 'Total',      value: counts.all,      color: 'var(--text)'  },
                { label: 'Pendientes', value: counts.watchlist, color: 'var(--accent)'},
                { label: 'Favoritas',  value: counts.favorite,  color: '#e05c5c'      },
                { label: 'Vistas',     value: counts.watched,   color: '#5ce07a'      },
                { label: 'Nota media', value: avgRating ?? '–', color: 'var(--accent)'},
              ].map(s => (
                <div key={s.label} style={{
                  background: 'var(--surface)', border: '1px solid var(--border)',
                  borderRadius: '12px', padding: '1rem 1.1rem',
                }}>
                  <p className="font-display" style={{ fontSize: '1.9rem', color: s.color, lineHeight: 1, marginBottom: '0.3rem' }}>
                    {s.value}
                  </p>
                  <p style={{ fontSize: '0.68rem', color: 'var(--muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    {s.label}
                  </p>
                </div>
              ))}
            </div>

            {/* ── Filtros ── */}
            <div style={{
              display: 'flex', gap: '0.2rem', marginBottom: '2rem',
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: '10px', padding: '0.3rem', width: 'fit-content',
            }}>
              {FILTERS.map(f => (
                <button key={f.value} onClick={() => setFilter(f.value)} style={{
                  display: 'flex', alignItems: 'center', gap: '0.4rem',
                  padding: '0.42rem 0.9rem', borderRadius: '7px',
                  border: 'none', cursor: 'pointer',
                  background: filter === f.value ? 'var(--surface2)' : 'transparent',
                  color: filter === f.value ? 'var(--text)' : 'var(--muted)',
                  fontSize: '0.8rem', fontWeight: filter === f.value ? 600 : 400,
                  transition: 'background 0.2s, color 0.2s',
                }}>
                  <span style={{ color: filter === f.value ? 'var(--accent)' : 'inherit' }}>{f.icon}</span>
                  {f.label}
                  <span style={{
                    fontSize: '0.65rem', fontWeight: 700,
                    color: filter === f.value ? 'var(--accent)' : 'var(--muted)',
                    background: filter === f.value ? 'rgba(201,168,76,0.12)' : 'rgba(255,255,255,0.04)',
                    padding: '1px 5px', borderRadius: '6px',
                  }}>{counts[f.value]}</span>
                </button>
              ))}
            </div>

            {/* ── Grid ── */}
            {filtered.length === 0 ? (
              <p style={{ color: 'var(--muted)', padding: '3rem 0' }}>No hay películas en esta categoría.</p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: '1.5rem' }}>
                {filtered.map((item, i) => (
                  <ListCard
                    key={item.id} item={item} index={i}
                    onChangeStatus={changeStatus}
                    onRemove={removeMovie}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </main>
  )
}

/* ─── Tarjeta de lista con acciones inline ─── */
function ListCard({ item, index, onChangeStatus, onRemove }) {
  const [hovered, setHovered] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const status = STATUS_META[item.status]

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setConfirming(false) }}
      style={{
        transform: hovered ? 'translateY(-5px)' : 'none',
        transition: 'transform 0.3s ease',
        animation: `scaleIn 0.4s ease ${0.04 * index}s both`,
      }}
    >
      {/* Poster */}
      <div style={{
        position: 'relative', aspectRatio: '2/3',
        borderRadius: '10px', overflow: 'hidden',
        background: 'var(--surface2)',
        boxShadow: hovered ? '0 16px 36px rgba(0,0,0,0.6)' : 'none',
        transition: 'box-shadow 0.3s',
      }}>
        {item.movies.poster_path ? (
          <Image
            src={`https://image.tmdb.org/t/p/w500${item.movies.poster_path}`}
            alt={item.movies.title} fill sizes="170px"
            style={{
              objectFit: 'cover',
              transform: hovered ? 'scale(1.05)' : 'scale(1)',
              transition: 'transform 0.5s ease',
            }}
          />
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--muted)', fontSize: '0.8rem' }}>
            Sin imagen
          </div>
        )}

        {/* Status badge */}
        <div style={{
          position: 'absolute', top: '8px', left: '8px',
          background: status?.bg, backdropFilter: 'blur(8px)',
          padding: '2px 8px', borderRadius: '5px',
          fontSize: '0.65rem', fontWeight: 700, color: status?.color,
          border: `1px solid ${status?.color}33`,
        }}>{status?.text}</div>

        {/* Rating */}
        {item.rating && (
          <div style={{
            position: 'absolute', top: '8px', right: '8px',
            background: 'rgba(10,10,15,0.85)', backdropFilter: 'blur(8px)',
            padding: '2px 8px', borderRadius: '5px',
            fontSize: '0.72rem', fontWeight: 700, color: 'var(--accent)',
          }}>★ {item.rating}</div>
        )}

        {/* Hover overlay con acciones */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(10,10,15,0.97) 0%, rgba(10,10,15,0.5) 45%, transparent 70%)',
          opacity: hovered ? 1 : 0,
          transition: 'opacity 0.3s',
          display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
          padding: '0.85rem',
          gap: '0.4rem',
        }}>
          {/* Ver detalles */}
          <Link href={`/movie/${item.movies.id}`} style={{
            display: 'block', textAlign: 'center',
            background: 'var(--accent)', color: 'var(--bg)',
            padding: '0.5rem', borderRadius: '6px',
            fontSize: '0.72rem', fontWeight: 700,
            textDecoration: 'none', letterSpacing: '0.06em', textTransform: 'uppercase',
            transform: hovered ? 'translateY(0)' : 'translateY(8px)',
            transition: 'transform 0.3s ease 0.05s',
          }}>Ver detalles</Link>

          {/* Cambiar estado */}
          <button onClick={() => onChangeStatus(item, NEXT_STATUS[item.status])} style={{
            background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)',
            color: 'var(--text)', padding: '0.45rem', borderRadius: '6px',
            fontSize: '0.7rem', cursor: 'pointer', width: '100%',
            transform: hovered ? 'translateY(0)' : 'translateY(8px)',
            transition: 'transform 0.3s ease 0.1s, background 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.12)'}
          onMouseLeave={e => e.currentTarget.style.background='rgba(255,255,255,0.07)'}
          >{NEXT_LABEL[item.status]}</button>

          {/* Eliminar */}
          {!confirming ? (
            <button onClick={() => setConfirming(true)} style={{
              background: 'transparent', border: '1px solid rgba(224,92,92,0.2)',
              color: '#e05c5c88', padding: '0.4rem', borderRadius: '6px',
              fontSize: '0.68rem', cursor: 'pointer', width: '100%',
              transform: hovered ? 'translateY(0)' : 'translateY(8px)',
              transition: 'transform 0.3s ease 0.15s, color 0.15s, border-color 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.color='#e05c5c'; e.currentTarget.style.borderColor='rgba(224,92,92,0.5)' }}
            onMouseLeave={e => { e.currentTarget.style.color='#e05c5c88'; e.currentTarget.style.borderColor='rgba(224,92,92,0.2)' }}
            >Eliminar de lista</button>
          ) : (
            <div style={{ display: 'flex', gap: '0.3rem' }}>
              <button onClick={() => onRemove(item)} style={{
                flex: 1, background: 'rgba(224,92,92,0.15)', border: '1px solid rgba(224,92,92,0.4)',
                color: '#e05c5c', padding: '0.4rem', borderRadius: '6px',
                fontSize: '0.68rem', cursor: 'pointer', fontWeight: 600,
              }}>Sí, eliminar</button>
              <button onClick={() => setConfirming(false)} style={{
                flex: 1, background: 'transparent', border: '1px solid var(--border)',
                color: 'var(--muted)', padding: '0.4rem', borderRadius: '6px',
                fontSize: '0.68rem', cursor: 'pointer',
              }}>Cancelar</button>
            </div>
          )}
        </div>
      </div>

      <p style={{
        marginTop: '0.6rem', fontSize: '0.84rem', fontWeight: 500,
        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        opacity: hovered ? 0.5 : 1, transition: 'opacity 0.3s',
      }}>{item.movies.title}</p>
    </div>
  )
}
