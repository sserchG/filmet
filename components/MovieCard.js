'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function MovieCard({ movie }) {
  const [hovered, setHovered] = useState(false)

  return (
    <Link href={`/movie/${movie.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          transform: hovered ? 'translateY(-8px) scale(1.03)' : 'translateY(0) scale(1)',
          boxShadow: hovered ? '0 24px 48px rgba(0,0,0,0.7)' : '0 4px 16px rgba(0,0,0,0.3)',
          transition: 'transform 0.35s cubic-bezier(0.4,0,0.2,1), box-shadow 0.35s ease',
        }}
      >
        {/* Poster container */}
        <div className="movie-card" style={{
          position: 'relative', aspectRatio: '2/3',
          borderRadius: '10px', overflow: 'hidden',
          background: 'var(--surface2)',
        }}>
          {movie.poster_path ? (
            <Image
              src={`https://image.tmdb.org/t/p/w780${movie.poster_path}`}
              alt={movie.title}
              fill
              sizes="(max-width: 768px) 50vw, 33vw"
              style={{ objectFit: 'cover' }}
            />
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--muted)', fontSize: '0.8rem' }}>
              Sin imagen
            </div>
          )}

          {/* Rating badge */}
          <div style={{
            position: 'absolute', top: '8px', right: '8px',
            background: 'rgba(10,10,15,0.85)',
            backdropFilter: 'blur(8px)',
            padding: '3px 8px',
            borderRadius: '5px',
            fontSize: '0.72rem',
            fontWeight: 700,
            color: 'var(--accent)',
            border: '1px solid rgba(201,168,76,0.15)',
            zIndex: 2,
          }}>
            ★ {movie.vote_average?.toFixed(1)}
          </div>

          {/* Hover overlay */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to top, rgba(10,10,15,0.97) 0%, rgba(10,10,15,0.5) 40%, transparent 70%)',
            opacity: hovered ? 1 : 0,
            transition: 'opacity 0.35s ease',
            display: 'flex', flexDirection: 'column',
            justifyContent: 'flex-end',
            padding: '1rem',
            zIndex: 1,
          }}>
            <p style={{
              fontSize: '0.82rem', fontWeight: 600, color: 'var(--text)',
              marginBottom: '0.3rem',
              transform: hovered ? 'translateY(0)' : 'translateY(8px)',
              transition: 'transform 0.35s ease',
              lineHeight: 1.3,
            }}>
              {movie.title}
            </p>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              transform: hovered ? 'translateY(0)' : 'translateY(8px)',
              transition: 'transform 0.35s ease 0.04s',
            }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--accent)' }}>★ {movie.vote_average?.toFixed(1)}</span>
              <span style={{ fontSize: '0.68rem', color: 'var(--muted)' }}>{movie.release_date?.slice(0, 4)}</span>
            </div>
            <div style={{
              marginTop: '0.75rem',
              display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
              background: 'var(--accent)', color: 'var(--bg)',
              padding: '0.4rem 0.9rem', borderRadius: '5px',
              fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
              transform: hovered ? 'translateY(0)' : 'translateY(8px)',
              transition: 'transform 0.35s ease 0.08s',
              alignSelf: 'flex-start',
            }}>
              Ver detalles →
            </div>
          </div>
        </div>

        {/* Title below card — hidden on hover since overlay shows it */}
        <p style={{
          marginTop: '0.65rem', fontSize: '0.85rem', fontWeight: 500,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          opacity: hovered ? 0.4 : 1,
          transition: 'opacity 0.3s ease',
        }}>
          {movie.title}
        </p>
        <p style={{ fontSize: '0.75rem', color: 'var(--muted)', opacity: hovered ? 0.3 : 1, transition: 'opacity 0.3s ease' }}>
          {movie.release_date?.slice(0, 4)}
        </p>
      </div>
    </Link>
  )
}
