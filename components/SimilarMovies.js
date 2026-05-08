'use client'
import { useState, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function SimilarMovies({ movies }) {
  if (!movies?.length) return null
  const scrollRef  = useRef(null)
  const [canLeft,  setCanLeft]  = useState(false)
  const [canRight, setCanRight] = useState(true)
  const [hovered,  setHovered]  = useState(false)
  const dragging   = useRef(false)
  const startX     = useRef(0)
  const scrollLeft = useRef(0)

  function updateArrows() {
    const el = scrollRef.current
    if (!el) return
    setCanLeft(el.scrollLeft > 8)
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8)
  }
  function scrollBy(dir) {
    scrollRef.current?.scrollBy({ left: dir * 700, behavior: 'smooth' })
  }
  function onMouseDown(e) {
    dragging.current = true
    startX.current = e.pageX - scrollRef.current.offsetLeft
    scrollLeft.current = scrollRef.current.scrollLeft
    scrollRef.current.style.cursor = 'grabbing'
  }
  function onMouseMove(e) {
    if (!dragging.current) return
    e.preventDefault()
    const x = e.pageX - scrollRef.current.offsetLeft
    scrollRef.current.scrollLeft = scrollLeft.current - (x - startX.current) * 1.2
  }
  function stopDrag() {
    dragging.current = false
    if (scrollRef.current) scrollRef.current.style.cursor = 'grab'
  }

  return (
    <div
      style={{ marginTop: '3rem', borderTop: '1px solid var(--border)', paddingTop: '2rem' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <h3 style={{ fontSize: '0.75rem', color: 'var(--accent)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1.5rem', padding: '0 0' }}>
        Películas similares
      </h3>

      <div style={{ position: 'relative' }}>
        {/* Left arrow */}
        <button onClick={() => scrollBy(-1)} style={{
          position: 'absolute', left: '-0.5rem', top: '50%', transform: 'translateY(-50%)',
          zIndex: 10, width: '36px', height: '36px', borderRadius: '50%',
          background: 'rgba(18,18,26,0.92)', backdropFilter: 'blur(8px)',
          border: '1px solid rgba(201,168,76,0.3)', color: 'var(--accent)',
          fontSize: '1.1rem', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          opacity: hovered && canLeft ? 1 : 0,
          pointerEvents: hovered && canLeft ? 'all' : 'none',
          transition: 'opacity 0.2s',
        }}>‹</button>

        {/* Scroll strip */}
        <div
          ref={scrollRef}
          onScroll={updateArrows}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={stopDrag}
          onMouseLeave={stopDrag}
          style={{
            display: 'flex', gap: '0.8rem', overflowX: 'auto',
            paddingBottom: '0.5rem', cursor: 'grab',
            scrollbarWidth: 'none', msOverflowStyle: 'none',
          }}
        >
          {movies.map((movie) => (
            <SimilarCard key={movie.id} movie={movie} />
          ))}
        </div>

        {/* Right arrow */}
        <button onClick={() => scrollBy(1)} style={{
          position: 'absolute', right: '-0.5rem', top: '50%', transform: 'translateY(-50%)',
          zIndex: 10, width: '36px', height: '36px', borderRadius: '50%',
          background: 'rgba(18,18,26,0.92)', backdropFilter: 'blur(8px)',
          border: '1px solid rgba(201,168,76,0.3)', color: 'var(--accent)',
          fontSize: '1.1rem', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          opacity: hovered && canRight ? 1 : 0,
          pointerEvents: hovered && canRight ? 'all' : 'none',
          transition: 'opacity 0.2s',
        }}>›</button>
      </div>
    </div>
  )
}

function SimilarCard({ movie }) {
  const [hov, setHov] = useState(false)
  const img = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/w500${movie.backdrop_path}`
    : movie.poster_path
      ? `https://image.tmdb.org/t/p/w342${movie.poster_path}`
      : null

  return (
    <Link href={`/movie/${movie.id}`} style={{ textDecoration: 'none', color: 'inherit', flexShrink: 0 }}>
      <div
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          position: 'relative', width: '220px', height: '130px',
          borderRadius: '10px', overflow: 'hidden',
          background: 'var(--surface2)',
          border: `1px solid ${hov ? 'rgba(201,168,76,0.3)' : 'var(--border)'}`,
          transform: hov ? 'translateY(-3px)' : 'none',
          transition: 'transform 0.2s, border-color 0.2s',
        }}
      >
        {img && (
          <Image src={img} alt={movie.title} fill sizes="220px"
            style={{ objectFit: 'cover', transform: hov ? 'scale(1.05)' : 'scale(1)', transition: 'transform 0.4s' }} />
        )}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,10,15,0.92) 0%, transparent 60%)' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0.6rem 0.75rem' }}>
          <p style={{ fontSize: '0.8rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{movie.title}</p>
          <p style={{ fontSize: '0.68rem', color: 'var(--muted)' }}>{movie.release_date?.slice(0, 4)}{movie.vote_average > 0 ? ` · ★ ${movie.vote_average.toFixed(1)}` : ''}</p>
        </div>
      </div>
    </Link>
  )
}
