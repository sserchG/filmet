'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function CartelaClient({ movies: initialMovies, totalPages: totalPagesInit = 1 }) {
  const [movies,      setMovies]      = useState(initialMovies)
  const [page,        setPage]        = useState(1)
  const [totalPages,  setTotalPages]  = useState(totalPagesInit)
  const [loadingMore, setLoadingMore] = useState(false)

  const hero = movies.find(m => m.backdrop_path) || movies[0]

  async function loadMore() {
    const next = page + 1
    setLoadingMore(true)
    const res  = await fetch(`/api/now-playing?page=${next}`)
    const data = await res.json()
    setMovies(prev => [...prev, ...(data.results || [])])
    setPage(next)
    setLoadingMore(false)
  }

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)' }}>

      {/* Hero backdrop */}
      {hero?.backdrop_path && (
        <div style={{ position: 'relative', height: '420px', overflow: 'hidden' }}>
          <Image
            src={`https://image.tmdb.org/t/p/original${hero.backdrop_path}`}
            alt={hero.title} fill sizes="100vw"
            style={{ objectFit: 'cover', objectPosition: 'center 20%' }} priority
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, var(--bg) 0%, rgba(10,10,15,0.6) 55%, rgba(10,10,15,0.2) 100%)' }} />
          <div style={{ position: 'absolute', bottom: '2.5rem', left: '2.5rem' }}>
            <p style={{ fontSize: '0.62rem', color: 'var(--accent)', letterSpacing: '0.35em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
              España · Semana actual
            </p>
            <h1 className="font-display" style={{ fontSize: 'clamp(3rem, 7vw, 6rem)', lineHeight: 0.88 }}>
              Cartelera
            </h1>
          </div>
          <div style={{
            position: 'absolute', bottom: '2.8rem', right: '2.5rem',
            background: 'rgba(10,10,15,0.7)', backdropFilter: 'blur(12px)',
            border: '1px solid var(--border)', borderRadius: '10px',
            padding: '0.8rem 1.2rem', textAlign: 'center',
          }}>
            <p className="font-display" style={{ fontSize: '2rem', color: 'var(--accent)', lineHeight: 1 }}>{movies.length}</p>
            <p style={{ fontSize: '0.62rem', color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Películas</p>
          </div>
        </div>
      )}

      {/* Grid */}
      <section style={{ padding: '3rem 2.5rem 6rem', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '1.8rem',
        }}>
          {movies.map((movie, i) => (
            <MoviePosterCard key={movie.id} movie={movie} index={i} />
          ))}
        </div>

        {page < totalPages && (
          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <button
              onClick={loadMore}
              disabled={loadingMore}
              style={{
                background: 'transparent',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                padding: '0.75rem 2.5rem',
                color: loadingMore ? 'var(--muted)' : 'var(--text)',
                fontSize: '0.82rem', fontWeight: 500,
                letterSpacing: '0.08em', cursor: loadingMore ? 'not-allowed' : 'pointer',
                transition: 'border-color 0.2s, color 0.2s',
              }}
              onMouseEnter={e => { if (!loadingMore) { e.currentTarget.style.borderColor = 'rgba(201,168,76,0.4)'; e.currentTarget.style.color = 'var(--accent)' }}}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text)' }}
            >
              {loadingMore ? 'Cargando...' : 'Cargar más películas'}
            </button>
          </div>
        )}
      </section>
    </main>
  )
}

function MoviePosterCard({ movie, index }) {
  const [hovered, setHovered] = useState(false)

  return (
    <Link href={`/movie/${movie.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
      <div style={{ animation: `scaleIn 0.45s ease ${0.03 * index}s both` }}>
        <div
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            position: 'relative', aspectRatio: '2/3',
            borderRadius: '12px', overflow: 'hidden',
            background: 'var(--surface2)',
            transform: hovered ? 'translateY(-6px) scale(1.02)' : 'none',
            boxShadow: hovered ? '0 20px 50px rgba(0,0,0,0.7)' : 'none',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          }}
        >
          {movie.poster_path ? (
            <Image
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title} fill sizes="220px"
              style={{ objectFit: 'cover', transform: hovered ? 'scale(1.04)' : 'scale(1)', transition: 'transform 0.4s ease' }}
            />
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--muted)', fontSize: '0.8rem', padding: '1rem', textAlign: 'center' }}>
              {movie.title}
            </div>
          )}

          {/* Rating badge */}
          <div style={{
            position: 'absolute', top: '8px', right: '8px',
            background: 'rgba(10,10,15,0.85)', backdropFilter: 'blur(8px)',
            padding: '3px 8px', borderRadius: '6px',
            fontSize: '0.72rem', fontWeight: 700, color: 'var(--accent)',
            border: '1px solid rgba(201,168,76,0.2)',
          }}>★ {movie.vote_average?.toFixed(1)}</div>

          {/* Hover overlay */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to top, rgba(10,10,15,0.95) 0%, transparent 55%)',
            opacity: hovered ? 1 : 0,
            transition: 'opacity 0.3s',
            display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '1rem',
          }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--accent)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Ver detalles →
            </span>
          </div>
        </div>

        <p style={{ marginTop: '0.7rem', fontSize: '0.85rem', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {movie.title}
        </p>
        <p style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>
          {movie.release_date?.slice(0, 4)}
        </p>
      </div>
    </Link>
  )
}
