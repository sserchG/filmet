'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

const genreMap = {
  28:'Acción',12:'Aventura',16:'Animación',35:'Comedia',80:'Crimen',
  99:'Documental',18:'Drama',10751:'Familia',14:'Fantasía',36:'Historia',
  27:'Terror',10402:'Música',9648:'Misterio',10749:'Romance',878:'Sci-Fi',
  53:'Suspense',10752:'Bélica',37:'Western',
}

const TABS = [
  { key: 'trending',  label: 'Tendencias',      badge: 'Esta semana' },
  { key: 'popular',   label: 'Popular',          badge: 'Ahora mismo' },
  { key: 'toprated',  label: 'Mejor valoradas',  badge: 'De todos los tiempos' },
]

export default function PopularClient({ trending, popular, topRated }) {
  const [activeTab, setActiveTab] = useState('trending')

  const dataMap = { trending, popular, toprated: topRated }
  const movies  = dataMap[activeTab] ?? []
  const featured = movies[0]
  const rest     = movies.slice(1)
  const currentTab = TABS.find(t => t.key === activeTab)

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)', paddingTop: '64px' }}>

      {/* ── PAGE HEADER ── */}
      <div style={{ padding: '3.5rem 2.5rem 0', maxWidth: '1200px', margin: '0 auto' }}>
        <p style={{ fontSize: '0.62rem', color: 'var(--accent)', letterSpacing: '0.38em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
          Descubrir
        </p>
        <h1 className="font-display" style={{ fontSize: 'clamp(2.8rem, 5vw, 4.5rem)', lineHeight: 0.88, marginBottom: '2.2rem' }}>
          Películas
        </h1>

        {/* ── TABS ── */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', marginBottom: '2.5rem', gap: '0' }}>
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                padding: '0.8rem 1.6rem',
                background: 'transparent',
                border: 'none',
                borderBottom: `2px solid ${activeTab === tab.key ? 'var(--accent)' : 'transparent'}`,
                color: activeTab === tab.key ? 'var(--accent)' : 'var(--muted)',
                fontSize: '0.76rem',
                fontWeight: activeTab === tab.key ? 700 : 400,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                marginBottom: '-1px',
                transition: 'color 0.2s, border-color 0.2s',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div style={{ padding: '0 2.5rem 6rem', maxWidth: '1200px', margin: '0 auto' }}>

        {/* Featured */}
        {featured && <FeaturedCard movie={featured} badge={currentTab?.badge} />}

        {/* Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: '0.9rem',
          marginTop: '0.9rem',
        }}>
          {rest.map((movie, i) => (
            <GridCard key={movie.id} movie={movie} rank={i + 2} />
          ))}
        </div>
      </div>
    </main>
  )
}

/* ─── Featured card (full-width hero) ─── */
function FeaturedCard({ movie, badge }) {
  const [hovered, setHovered] = useState(false)

  return (
    <Link href={`/movie/${movie.id}`} style={{ textDecoration: 'none', display: 'block', marginBottom: '0.9rem' }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          position: 'relative',
          height: '420px',
          borderRadius: '16px',
          overflow: 'hidden',
          background: 'var(--surface)',
          border: `1px solid ${hovered ? 'rgba(201,168,76,0.3)' : 'var(--border)'}`,
          transition: 'border-color 0.25s',
        }}
      >
        {movie.backdrop_path && (
          <Image
            src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
            alt={movie.title} fill sizes="100vw"
            style={{
              objectFit: 'cover', objectPosition: 'center 25%',
              transform: hovered ? 'scale(1.025)' : 'scale(1)',
              transition: 'transform 0.6s ease',
            }}
            priority
          />
        )}

        {/* Gradient */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(10,10,15,0.96) 30%, rgba(10,10,15,0.5) 65%, rgba(10,10,15,0.1) 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,10,15,0.6) 0%, transparent 50%)' }} />

        {/* #01 watermark */}
        <div className="font-display" style={{
          position: 'absolute', top: '-0.1em', right: '1.5rem',
          fontSize: 'clamp(7rem, 16vw, 14rem)', lineHeight: 0.8,
          color: 'var(--accent)', opacity: 0.07,
          userSelect: 'none', pointerEvents: 'none',
        }}>01</div>

        {/* Badge */}
        {badge && (
          <div style={{
            position: 'absolute', top: '1.6rem', left: '1.6rem',
            background: 'var(--accent)', color: 'var(--bg)',
            fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.22em',
            padding: '0.28rem 0.8rem', borderRadius: '4px',
            textTransform: 'uppercase',
          }}>
            #{1} {badge}
          </div>
        )}

        {/* Info */}
        <div style={{ position: 'absolute', bottom: '2.5rem', left: '2.2rem', maxWidth: '500px' }}>
          <h2 className="font-display" style={{
            fontSize: 'clamp(2rem, 3.8vw, 3.2rem)',
            lineHeight: 0.92, marginBottom: '0.8rem', color: 'var(--text)',
          }}>
            {movie.title}
          </h2>

          <div style={{ display: 'flex', gap: '0.9rem', alignItems: 'center', marginBottom: '0.8rem', flexWrap: 'wrap' }}>
            <span style={{ color: 'var(--accent)', fontWeight: 700, fontSize: '0.95rem' }}>
              ★ {movie.vote_average?.toFixed(1)}
            </span>
            <span style={{ color: 'var(--muted)', fontSize: '0.82rem' }}>
              {movie.release_date?.slice(0, 4)}
            </span>
            {movie.genre_ids?.[0] && (
              <span style={{
                color: 'var(--muted)', fontSize: '0.75rem',
                border: '1px solid var(--border)', padding: '0.18rem 0.6rem', borderRadius: '4px',
              }}>
                {genreMap[movie.genre_ids[0]] || ''}
              </span>
            )}
            {movie.genre_ids?.[1] && (
              <span style={{
                color: 'var(--muted)', fontSize: '0.75rem',
                border: '1px solid var(--border)', padding: '0.18rem 0.6rem', borderRadius: '4px',
              }}>
                {genreMap[movie.genre_ids[1]] || ''}
              </span>
            )}
          </div>

          <p style={{
            color: 'var(--muted)', fontSize: '0.87rem', lineHeight: 1.7,
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>
            {movie.overview}
          </p>

          <div style={{
            marginTop: '1.3rem',
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            background: hovered ? 'var(--accent)' : 'rgba(201,168,76,0.15)',
            border: '1px solid rgba(201,168,76,0.5)',
            color: hovered ? 'var(--bg)' : 'var(--accent)',
            padding: '0.6rem 1.6rem', borderRadius: '6px',
            fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
            transition: 'background 0.2s, color 0.2s',
          }}>
            Ver detalles →
          </div>
        </div>
      </div>
    </Link>
  )
}

/* ─── Quick watched toggle ─── */
function QuickWatched({ movie }) {
  const [watched, setWatched] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session?.user) return
      const { data } = await supabase
        .from('user_movies')
        .select('status')
        .eq('user_id', session.user.id)
        .eq('movie_id', movie.id)
        .single()
      if (data) setWatched(data.status === 'watched')
    })
  }, [movie.id])

  async function toggle(e) {
    e.preventDefault()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user) return
    if (watched) {
      await supabase.from('user_movies').delete()
        .eq('user_id', session.user.id).eq('movie_id', movie.id)
      setWatched(false)
    } else {
      await supabase.from('user_movies').upsert({
        user_id: session.user.id, movie_id: movie.id, status: 'watched',
        title: movie.title, poster_path: movie.poster_path,
      })
      setWatched(true)
    }
  }

  return (
    <button
      onClick={toggle}
      title={watched ? 'Marcar como no vista' : 'Marcar como vista'}
      style={{
        position: 'absolute', bottom: '0.6rem', right: '0.6rem',
        background: watched ? 'rgba(92,224,122,0.18)' : 'rgba(10,10,15,0.72)',
        backdropFilter: 'blur(6px)',
        border: `1px solid ${watched ? 'rgba(92,224,122,0.5)' : 'var(--border)'}`,
        borderRadius: '6px', padding: '0.22rem 0.5rem',
        fontSize: '0.7rem', color: watched ? '#5ce07a' : 'var(--muted)',
        cursor: 'pointer', transition: 'all 0.2s', zIndex: 2,
      }}
    >
      {watched ? '✓' : '○'}
    </button>
  )
}

/* ─── Grid card (landscape) ─── */
function GridCard({ movie, rank }) {
  const [hovered, setHovered] = useState(false)
  const img = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/w780${movie.backdrop_path}`
    : movie.poster_path
      ? `https://image.tmdb.org/t/p/w342${movie.poster_path}`
      : null

  return (
    <Link href={`/movie/${movie.id}`} style={{ textDecoration: 'none' }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          position: 'relative',
          height: '195px',
          borderRadius: '12px',
          overflow: 'hidden',
          background: 'var(--surface)',
          border: `1px solid ${hovered ? 'rgba(201,168,76,0.28)' : 'var(--border)'}`,
          transform: hovered ? 'translateY(-4px)' : 'none',
          transition: 'border-color 0.2s, transform 0.22s',
          cursor: 'pointer',
        }}
      >
        {img && (
          <Image
            src={img}
            alt={movie.title} fill
            sizes="(max-width: 768px) 100vw, 280px"
            style={{
              objectFit: 'cover',
              transform: hovered ? 'scale(1.06)' : 'scale(1)',
              transition: 'transform 0.45s ease',
            }}
          />
        )}

        {/* Gradient */}
        <div style={{
          position: 'absolute', inset: 0,
          background: hovered
            ? 'linear-gradient(to top, rgba(10,10,15,0.97) 0%, rgba(10,10,15,0.55) 55%, rgba(10,10,15,0.15) 100%)'
            : 'linear-gradient(to top, rgba(10,10,15,0.92) 0%, rgba(10,10,15,0.4) 55%, transparent 100%)',
          transition: 'background 0.3s',
        }} />

        {/* Rank watermark */}
        <div className="font-display" style={{
          position: 'absolute', top: '-0.12em', left: '0.6rem',
          fontSize: '3.5rem', lineHeight: 0.85,
          color: rank <= 3 ? 'var(--accent)' : 'var(--text)',
          opacity: rank <= 3 ? 0.18 : 0.08,
          userSelect: 'none', pointerEvents: 'none',
        }}>
          {String(rank).padStart(2, '0')}
        </div>

        {/* Rating pill */}
        <div style={{
          position: 'absolute', top: '0.7rem', right: '0.7rem',
          background: 'rgba(10,10,15,0.72)', backdropFilter: 'blur(6px)',
          border: '1px solid rgba(201,168,76,0.35)',
          padding: '0.18rem 0.5rem', borderRadius: '4px',
          fontSize: '0.7rem', fontWeight: 700, color: 'var(--accent)',
        }}>
          ★ {movie.vote_average?.toFixed(1)}
        </div>

        {/* Bottom info */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0.9rem 1rem' }}>
          <p style={{
            fontSize: '0.88rem', fontWeight: 600, marginBottom: '0.22rem',
            color: 'var(--text)', lineHeight: 1.2,
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            {movie.title}
          </p>
          <p style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>
            {movie.release_date?.slice(0, 4)}
            {movie.genre_ids?.[0] ? ' · ' + (genreMap[movie.genre_ids[0]] || '') : ''}
          </p>

          {/* Hover overview */}
          <div style={{
            maxHeight: hovered ? '60px' : '0px',
            overflow: 'hidden',
            transition: 'max-height 0.25s ease',
          }}>
            <p style={{
              fontSize: '0.74rem', color: 'var(--muted)', marginTop: '0.4rem', lineHeight: 1.55,
              display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
            }}>
              {movie.overview}
            </p>
          </div>
        </div>
      </div>
    </Link>
  )
}
