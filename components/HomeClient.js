'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function HomeClient({ movies, trending, upcoming, hero }) {
  const [splashDone, setSplashDone]     = useState(false)
  const [heroVisible, setHeroVisible]   = useState(false)
  const [contentVisible, setContentVisible] = useState(false)
  const [mousePos, setMousePos]         = useState({ x: 50, y: 50 })
  const heroRef    = useRef(null)
  const heroImgRef = useRef(null)

  useEffect(() => {
    const t1 = setTimeout(() => setHeroVisible(true), 800)
    const t2 = setTimeout(() => setSplashDone(true), 1800)
    const t3 = setTimeout(() => setContentVisible(true), 2100)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      if (heroImgRef.current)
        heroImgRef.current.style.transform = `scale(1.08) translateY(${window.scrollY * 0.22}px)`
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleMouseMove = (e) => {
    const rect = heroRef.current?.getBoundingClientRect()
    if (!rect) return
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    })
  }

  return (
    <>
      {/* SPLASH */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 998,
        background: 'var(--bg)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        pointerEvents: splashDone ? 'none' : 'all',
        opacity: splashDone ? 0 : 1,
        transition: 'opacity 0.7s ease',
      }}>
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0,
          height: heroVisible ? '0px' : '20vh',
          background: '#000',
          transition: 'height 0.8s cubic-bezier(0.4,0,0.2,1)',
        }}/>
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          height: heroVisible ? '0px' : '20vh',
          background: '#000',
          transition: 'height 0.8s cubic-bezier(0.4,0,0.2,1)',
        }}/>
        <h1 className="font-display" style={{
          fontSize: 'clamp(3.5rem, 12vw, 8rem)',
          color: 'var(--text)',
          opacity: heroVisible ? 1 : 0,
          letterSpacing: heroVisible ? '0.18em' : '0.7em',
          transition: 'opacity 0.9s ease, letter-spacing 0.9s ease',
          textShadow: heroVisible ? '0 0 40px rgba(201,168,76,0.3)' : 'none',
        }}>FILMET</h1>
        <div style={{
          width: heroVisible ? '60px' : '0px', height: '1px',
          background: 'var(--accent)',
          transition: 'width 0.8s ease 0.3s',
          opacity: heroVisible ? 1 : 0,
        }}/>
      </div>

      {/* CONTENIDO */}
      <div style={{ opacity: contentVisible ? 1 : 0, transition: 'opacity 0.9s ease' }}>

        {/* ── HERO ── */}
        <div ref={heroRef} onMouseMove={handleMouseMove}
          style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>
          <div ref={heroImgRef} style={{ position: 'absolute', inset: '-8% 0', transform: 'scale(1.08)' }}>
            <Image
              src={`https://image.tmdb.org/t/p/original${hero.backdrop_path}`}
              alt={hero.title} fill sizes="100vw"
              style={{ objectFit: 'cover', objectPosition: 'center 20%' }} priority
            />
          </div>
          <div style={{
            position: 'absolute', inset: 0,
            background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, rgba(201,168,76,0.07) 0%, transparent 55%)`,
            pointerEvents: 'none',
          }}/>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(10,10,15,0.94) 30%, rgba(10,10,15,0.15) 100%)' }}/>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, var(--bg) 0%, transparent 45%)' }}/>

          <div style={{ position: 'absolute', bottom: '8rem', left: '2.5rem', maxWidth: '540px' }}>
            <p style={{
              fontSize: '0.65rem', color: 'var(--accent)', letterSpacing: '0.35em',
              textTransform: 'uppercase', marginBottom: '1.2rem',
              animation: contentVisible ? 'slideInLeft 0.8s ease 0.1s both' : 'none',
            }}>Trending esta semana</p>
            <h2 className="font-display" style={{
              fontSize: 'clamp(2.8rem, 5.5vw, 5rem)', lineHeight: 0.92, marginBottom: '1.2rem',
              animation: contentVisible ? 'fadeUp 0.9s ease 0.25s both' : 'none',
            }}>{hero.title}</h2>
            <p style={{
              color: 'var(--muted)', fontSize: '0.95rem', lineHeight: 1.8, marginBottom: '2rem',
              display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden',
              animation: contentVisible ? 'fadeUp 0.9s ease 0.4s both' : 'none',
            }}>{hero.overview}</p>
            <div style={{
              display: 'flex', gap: '1rem', alignItems: 'center',
              animation: contentVisible ? 'fadeUp 0.9s ease 0.55s both' : 'none',
            }}>
              <Link href={`/movie/${hero.id}`} style={{
                background: 'var(--accent)', color: 'var(--bg)',
                padding: '0.9rem 2.4rem', borderRadius: '6px',
                fontSize: '0.8rem', fontWeight: 700,
                textDecoration: 'none', letterSpacing: '0.1em', textTransform: 'uppercase',
                boxShadow: '0 8px 24px rgba(201,168,76,0.3)',
              }}>Ver detalles</Link>
              <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                <span style={{ color: 'var(--accent)' }}>★</span>
                <span style={{ fontWeight: 600 }}>{hero.vote_average?.toFixed(1)}</span>
                <span style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>· {hero.release_date?.slice(0, 4)}</span>
              </div>
            </div>
          </div>

          {/* Scroll indicator */}
          <div style={{
            position: 'absolute', bottom: '2.5rem', left: '50%', transform: 'translateX(-50%)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem',
            animation: 'fadeIn 1s ease 1.2s both', opacity: 0,
          }}>
            <span style={{ fontSize: '0.6rem', color: 'var(--muted)', letterSpacing: '0.25em', textTransform: 'uppercase' }}>Scroll</span>
            <div style={{ width: '1px', height: '36px', overflow: 'hidden' }}>
              <div style={{
                width: '1px', height: '100%',
                background: 'linear-gradient(to bottom, transparent, var(--accent), transparent)',
                animation: 'scrollLine 1.6s ease infinite',
                transformOrigin: 'top',
              }}/>
            </div>
          </div>
        </div>

        {/* ── EN CINES ── */}
        <ScrollReveal>
          <section style={{ padding: '5rem 0 3rem' }}>
            <div style={{ padding: '0 2.5rem' }}>
              <SectionHeader label="España · Semana actual" title="En cines ahora" linkHref="/cartelera" linkLabel="Ver cartelera" />
            </div>
            <HScrollStrip itemWidth={182}>
              {movies.slice(0, 10).map((movie, i) => (
                <Link key={movie.id} href={`/movie/${movie.id}`}
                  style={{ textDecoration: 'none', color: 'inherit', flexShrink: 0 }}>
                  <PosterCard movie={movie} index={i} />
                </Link>
              ))}
            </HScrollStrip>
          </section>
        </ScrollReveal>

        {/* ── PRÓXIMAMENTE ── */}
        <ScrollReveal delay={80}>
          <section style={{ padding: '2rem 0 3rem' }}>
            <div style={{ padding: '0 2.5rem' }}>
              <SectionHeader label="Próximos estrenos" title="Próximamente" linkHref="/cartelera" linkLabel="Ver cartelera" />
            </div>
            <UpcomingCarousel movies={upcoming} />
          </section>
        </ScrollReveal>

        {/* ── TRENDING: tarjetas de paisaje grandes ── */}
        <ScrollReveal delay={120}>
          <section style={{ padding: '2rem 0 7rem' }}>
            <div style={{ padding: '0 2.5rem' }}>
              <SectionHeader label="Tendencia global · Esta semana" title="Lo más visto" />
            </div>
            <HScrollStrip itemWidth={376}>
              {trending.map((movie, i) => (
                <BackdropCard key={movie.id} movie={movie} index={i} />
              ))}
            </HScrollStrip>
          </section>
        </ScrollReveal>

      </div>
    </>
  )
}

/* ─── Poster card (En cines) ─── */
function PosterCard({ movie, index }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: '170px',
        transform: hovered ? 'translateY(-8px) scale(1.03)' : 'translateY(0) scale(1)',
        boxShadow: hovered ? '0 24px 48px rgba(0,0,0,0.7)' : 'none',
        transition: 'transform 0.35s cubic-bezier(0.4,0,0.2,1), box-shadow 0.35s ease',
        animation: `scaleIn 0.5s ease ${0.05 * index}s both`,
      }}
    >
      <div className="movie-card" style={{
        position: 'relative', width: '170px', height: '255px',
        borderRadius: '10px', overflow: 'hidden', background: 'var(--surface2)',
      }}>
        {movie.poster_path && (
          <Image src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`}
            alt={movie.title} fill sizes="170px" style={{ objectFit: 'cover' }} />
        )}
        <div style={{
          position: 'absolute', top: '8px', right: '8px',
          background: 'rgba(10,10,15,0.85)', backdropFilter: 'blur(8px)',
          padding: '3px 8px', borderRadius: '5px',
          fontSize: '0.7rem', fontWeight: 700, color: 'var(--accent)',
          border: '1px solid rgba(201,168,76,0.15)',
        }}>★ {movie.vote_average?.toFixed(1)}</div>
        {/* hover overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(10,10,15,0.95) 0%, transparent 60%)',
          opacity: hovered ? 1 : 0, transition: 'opacity 0.3s ease',
          display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '0.8rem',
        }}>
          <span style={{
            fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.08em',
            textTransform: 'uppercase', color: 'var(--accent)',
            transform: hovered ? 'translateY(0)' : 'translateY(6px)',
            transition: 'transform 0.3s ease',
          }}>Ver detalles →</span>
        </div>
      </div>
      <p style={{
        marginTop: '0.7rem', fontSize: '0.82rem', fontWeight: 500,
        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        opacity: hovered ? 0.5 : 1, transition: 'opacity 0.3s',
      }}>{movie.title}</p>
      <p style={{ fontSize: '0.72rem', color: 'var(--muted)', opacity: hovered ? 0.3 : 1, transition: 'opacity 0.3s' }}>
        {movie.release_date?.slice(0, 4)}
      </p>
    </div>
  )
}

/* ─── Backdrop card (Trending) ─── */
function BackdropCard({ movie, index }) {
  const [hovered, setHovered] = useState(false)
  const num = String(index + 1).padStart(2, '0')

  return (
    <Link href={`/movie/${movie.id}`} style={{ textDecoration: 'none', color: 'inherit', flexShrink: 0 }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          position: 'relative', width: '360px', height: '210px',
          borderRadius: '12px', overflow: 'hidden',
          background: 'var(--surface2)',
          transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
          boxShadow: hovered ? '0 20px 44px rgba(0,0,0,0.7)' : '0 4px 20px rgba(0,0,0,0.4)',
          transition: 'transform 0.35s ease, box-shadow 0.35s ease',
          animation: `scaleIn 0.5s ease ${0.06 * index}s both`,
        }}
      >
        {movie.backdrop_path && (
          <Image
            src={`https://image.tmdb.org/t/p/w780${movie.backdrop_path}`}
            alt={movie.title} fill sizes="360px"
            style={{
              objectFit: 'cover',
              transform: hovered ? 'scale(1.06)' : 'scale(1)',
              transition: 'transform 0.5s ease',
            }}
          />
        )}
        {/* Dark overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(135deg, rgba(10,10,15,0.7) 0%, rgba(10,10,15,0.2) 60%, transparent 100%)',
        }}/>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(10,10,15,0.9) 0%, transparent 55%)',
        }}/>

        {/* Big number */}
        <div className="font-display" style={{
          position: 'absolute', top: '-8px', left: '12px',
          fontSize: '5.5rem', lineHeight: 1,
          color: index < 3 ? 'var(--accent)' : 'rgba(255,255,255,0.12)',
          textShadow: index < 3 ? '0 0 30px rgba(201,168,76,0.4)' : 'none',
          userSelect: 'none',
        }}>{num}</div>

        {/* Info bottom */}
        <div style={{ position: 'absolute', bottom: '1rem', left: '1rem', right: '1rem' }}>
          <p style={{
            fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.3rem',
            transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
            transition: 'transform 0.3s ease',
          }}>{movie.title}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 600 }}>★ {movie.vote_average?.toFixed(1)}</span>
            <span style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>{movie.release_date?.slice(0, 4)}</span>
          </div>
        </div>

        {/* Rating pill top-right */}
        <div style={{
          position: 'absolute', top: '10px', right: '10px',
          background: 'rgba(10,10,15,0.8)', backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,0.08)',
          padding: '3px 10px', borderRadius: '20px',
          fontSize: '0.7rem', color: 'var(--muted)',
        }}>Trending</div>
      </div>
    </Link>
  )
}

/* ─── Upcoming carousel (auto-avance) ─── */
const SLIDE_MS = 5500

function UpcomingCarousel({ movies }) {
  const [active,   setActive]   = useState(0)
  const [prev,     setPrev]     = useState(null)
  const [paused,   setPaused]   = useState(false)
  const [tick,     setTick]     = useState(0)   // reset progress key
  const timerRef  = useRef(null)

  const go = (idx) => {
    setPrev(active)
    setActive(idx)
    setTick(t => t + 1)
  }

  const next = () => go((active + 1) % movies.length)
  const prev_ = () => go((active - 1 + movies.length) % movies.length)

  useEffect(() => {
    if (paused) { clearInterval(timerRef.current); return }
    timerRef.current = setInterval(next, SLIDE_MS)
    return () => clearInterval(timerRef.current)
  }, [paused, active])

  const movie = movies[active]
  if (!movie) return null

  const releaseDate = movie.release_date ? new Date(movie.release_date) : null
  const today       = new Date()
  const daysUntil   = releaseDate ? Math.ceil((releaseDate - today) / (1000 * 60 * 60 * 24)) : null
  const day   = releaseDate?.toLocaleDateString('es-ES', { day: '2-digit' })
  const month = releaseDate?.toLocaleDateString('es-ES', { month: 'long' })
  const year  = releaseDate?.getFullYear()

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      style={{ position: 'relative', margin: '0 0', overflow: 'hidden' }}
    >
      {/* ── SLIDE ── */}
      <div key={active} style={{
        position: 'relative', height: '480px', overflow: 'hidden',
        animation: 'fadeIn 0.6s ease',
      }}>
        {/* Backdrop */}
        {movie.backdrop_path && (
          <Image
            src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
            alt={movie.title} fill sizes="100vw"
            style={{ objectFit: 'cover', objectPosition: 'center 25%' }}
          />
        )}

        {/* Gradients */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(10,10,15,0.97) 35%, rgba(10,10,15,0.55) 65%, rgba(10,10,15,0.15) 100%)' }}/>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,10,15,1) 0%, transparent 45%)' }}/>

        {/* Content */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center',
          padding: '0 2.5rem',
          gap: '3rem',
        }}>
          {/* Left — info */}
          <div style={{ flex: 1, maxWidth: '520px' }}>
            {/* Label */}
            <p style={{
              fontSize: '0.6rem', color: 'var(--accent)',
              letterSpacing: '0.35em', textTransform: 'uppercase',
              marginBottom: '1rem',
              animation: 'slideInLeft 0.5s ease 0.1s both',
            }}>
              Próximo estreno
            </p>

            {/* Title */}
            <h2 className="font-display" style={{
              fontSize: 'clamp(2.2rem, 4vw, 3.5rem)',
              lineHeight: 0.92, marginBottom: '1rem',
              animation: 'fadeUp 0.5s ease 0.2s both',
            }}>
              {movie.title}
            </h2>

            {/* Date + countdown */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '1rem',
              marginBottom: '1.1rem',
              animation: 'fadeUp 0.5s ease 0.3s both',
            }}>
              {releaseDate && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  background: 'rgba(201,168,76,0.1)',
                  border: '1px solid rgba(201,168,76,0.3)',
                  borderRadius: '8px', padding: '0.5rem 1rem',
                }}>
                  <span className="font-display" style={{ fontSize: '1.8rem', color: 'var(--accent)', lineHeight: 1 }}>{day}</span>
                  <div>
                    <p style={{ fontSize: '0.65rem', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{month}</p>
                    <p style={{ fontSize: '0.6rem', color: 'var(--muted)' }}>{year}</p>
                  </div>
                </div>
              )}
              {daysUntil !== null && daysUntil > 0 && (
                <div style={{ textAlign: 'center' }}>
                  <p className="font-display" style={{ fontSize: '2.2rem', color: 'var(--text)', lineHeight: 1 }}>{daysUntil}</p>
                  <p style={{ fontSize: '0.6rem', color: 'var(--muted)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>días</p>
                </div>
              )}
              {daysUntil !== null && daysUntil <= 0 && (
                <span style={{
                  background: 'rgba(92,224,122,0.12)',
                  border: '1px solid rgba(92,224,122,0.3)',
                  borderRadius: '6px', padding: '0.35rem 0.9rem',
                  fontSize: '0.72rem', fontWeight: 700, color: '#5ce07a',
                }}>Ya en cines</span>
              )}
            </div>

            {/* Genres */}
            <div style={{
              display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1rem',
              animation: 'fadeUp 0.5s ease 0.35s both',
            }}>
              {movie.genre_ids?.slice(0, 3).map(id => genreMap[id] && (
                <span key={id} style={{
                  fontSize: '0.68rem', color: 'var(--muted)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  padding: '0.18rem 0.65rem', borderRadius: '20px',
                }}>{genreMap[id]}</span>
              ))}
            </div>

            {/* Overview */}
            <p style={{
              color: 'var(--muted)', fontSize: '0.88rem', lineHeight: 1.75,
              display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden',
              marginBottom: '1.5rem',
              animation: 'fadeUp 0.5s ease 0.4s both',
            }}>
              {movie.overview || 'Sin sinopsis disponible.'}
            </p>

            {/* CTA */}
            <Link href={`/movie/${movie.id}`} style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              background: 'var(--accent)', color: 'var(--bg)',
              padding: '0.75rem 2rem', borderRadius: '6px',
              fontSize: '0.76rem', fontWeight: 700, letterSpacing: '0.1em',
              textDecoration: 'none', textTransform: 'uppercase',
              boxShadow: '0 8px 24px rgba(201,168,76,0.3)',
              animation: 'fadeUp 0.5s ease 0.5s both',
            }}>
              Ver detalles
            </Link>
          </div>

          {/* Right — poster flotante */}
          {movie.poster_path && (
            <div style={{
              flexShrink: 0,
              position: 'relative', width: '200px', height: '300px',
              borderRadius: '14px', overflow: 'hidden',
              boxShadow: '0 30px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.06)',
              animation: 'fadeUp 0.6s ease 0.15s both',
              display: 'flex',
            }}>
              <Image
                src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`}
                alt={movie.title} fill sizes="200px"
                style={{ objectFit: 'cover' }}
              />
            </div>
          )}
        </div>

        {/* Arrow buttons */}
        <button onClick={prev_} style={arrowStyle('left')}>‹</button>
        <button onClick={next}  style={arrowStyle('right')}>›</button>
      </div>

      {/* ── PROGRESS BAR ── */}
      <div style={{ height: '2px', background: 'var(--border)', position: 'relative', overflow: 'hidden' }}>
        <div
          key={tick}
          style={{
            position: 'absolute', left: 0, top: 0, height: '100%',
            background: 'var(--accent)',
            width: paused ? undefined : '100%',
            animation: paused ? 'none' : `progressBar ${SLIDE_MS}ms linear forwards`,
          }}
        />
      </div>

      {/* ── THUMBNAILS ── */}
      <div className="hide-scrollbar" style={{
        display: 'flex', gap: '0.6rem', overflowX: 'auto',
        padding: '1.2rem 2.5rem 0',
      }}>
        {movies.map((m, i) => (
          <button
            key={m.id}
            onClick={() => go(i)}
            style={{
              flexShrink: 0,
              position: 'relative', width: '80px', height: '52px',
              borderRadius: '6px', overflow: 'hidden', padding: 0,
              border: `2px solid ${i === active ? 'var(--accent)' : 'transparent'}`,
              opacity: i === active ? 1 : 0.45,
              transform: i === active ? 'scale(1.05)' : 'scale(1)',
              transition: 'all 0.25s ease',
              cursor: 'pointer', background: 'var(--surface2)',
            }}
          >
            {(m.backdrop_path || m.poster_path) && (
              <Image
                src={m.backdrop_path
                  ? `https://image.tmdb.org/t/p/w300${m.backdrop_path}`
                  : `https://image.tmdb.org/t/p/w185${m.poster_path}`}
                alt={m.title} fill sizes="80px"
                style={{ objectFit: 'cover' }}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

function arrowStyle(side) {
  return {
    position: 'absolute', top: '50%', transform: 'translateY(-50%)',
    [side]: '1.2rem',
    width: '44px', height: '44px', borderRadius: '50%',
    background: 'rgba(18,18,26,0.85)', backdropFilter: 'blur(8px)',
    border: '1px solid rgba(201,168,76,0.3)',
    color: 'var(--accent)', fontSize: '1.4rem', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 10, transition: 'background 0.2s, border-color 0.2s',
  }
}

/* ─── Upcoming card — YA NO SE USA (reemplazada por carousel) ─── */
function UpcomingCard({ movie, index }) {
  const [hovered, setHovered] = useState(false)

  const releaseDate = movie.release_date ? new Date(movie.release_date) : null
  const today       = new Date()
  const daysUntil   = releaseDate
    ? Math.ceil((releaseDate - today) / (1000 * 60 * 60 * 24))
    : null

  const day   = releaseDate?.toLocaleDateString('es-ES', { day: '2-digit' })
  const month = releaseDate?.toLocaleDateString('es-ES', { month: 'short' }).replace('.', '').toUpperCase()
  const year  = releaseDate?.getFullYear()

  const img = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/w780${movie.backdrop_path}`
    : movie.poster_path
      ? `https://image.tmdb.org/t/p/w342${movie.poster_path}`
      : null

  return (
    <Link href={`/movie/${movie.id}`} style={{ textDecoration: 'none', color: 'inherit', flexShrink: 0 }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          position: 'relative',
          width: '340px',
          height: '230px',
          borderRadius: '14px',
          overflow: 'hidden',
          background: 'var(--surface)',
          border: `1px solid ${hovered ? 'rgba(201,168,76,0.3)' : 'var(--border)'}`,
          transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
          boxShadow: hovered ? '0 22px 50px rgba(0,0,0,0.7)' : '0 4px 20px rgba(0,0,0,0.3)',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.2s',
          animation: `scaleIn 0.5s ease ${0.06 * index}s both`,
          cursor: 'pointer',
        }}
      >
        {/* Backdrop */}
        {img && (
          <Image
            src={img}
            alt={movie.title} fill
            sizes="340px"
            style={{
              objectFit: 'cover',
              transform: hovered ? 'scale(1.07)' : 'scale(1)',
              transition: 'transform 0.5s ease',
            }}
          />
        )}

        {/* Gradients */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(10,10,15,0.98) 0%, rgba(10,10,15,0.55) 50%, rgba(10,10,15,0.15) 100%)',
        }}/>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to right, rgba(10,10,15,0.5) 0%, transparent 60%)',
        }}/>

        {/* Calendar badge — top left */}
        <div style={{
          position: 'absolute', top: '1rem', left: '1rem',
          background: 'rgba(10,10,15,0.75)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(201,168,76,0.25)',
          borderRadius: '10px',
          padding: '0.5rem 0.75rem',
          textAlign: 'center',
          minWidth: '48px',
        }}>
          <p className="font-display" style={{ fontSize: '1.5rem', lineHeight: 1, color: 'var(--accent)' }}>{day}</p>
          <p style={{ fontSize: '0.58rem', color: 'var(--muted)', letterSpacing: '0.12em', marginTop: '1px' }}>{month} {year}</p>
        </div>

        {/* Days countdown — top right */}
        {daysUntil !== null && (
          <div style={{
            position: 'absolute', top: '1rem', right: '1rem',
            background: daysUntil <= 0
              ? 'rgba(201,168,76,0.15)'
              : 'rgba(10,10,15,0.7)',
            backdropFilter: 'blur(10px)',
            border: `1px solid ${daysUntil <= 0 ? 'rgba(201,168,76,0.4)' : 'rgba(255,255,255,0.1)'}`,
            borderRadius: '8px',
            padding: '0.35rem 0.7rem',
            textAlign: 'center',
          }}>
            {daysUntil > 0 ? (
              <>
                <p className="font-display" style={{ fontSize: '1.1rem', lineHeight: 1, color: 'var(--accent)' }}>{daysUntil}</p>
                <p style={{ fontSize: '0.54rem', color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>días</p>
              </>
            ) : (
              <p style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--accent)', letterSpacing: '0.06em' }}>En cines</p>
            )}
          </div>
        )}

        {/* Bottom info */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '1.1rem 1.1rem 1rem' }}>
          {/* Genre chips */}
          <div style={{ display: 'flex', gap: '0.35rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
            {movie.genre_ids?.slice(0, 2).map(id => genreMap[id] && (
              <span key={id} style={{
                fontSize: '0.6rem', color: 'var(--muted)',
                border: '1px solid rgba(255,255,255,0.12)',
                padding: '0.1rem 0.55rem', borderRadius: '20px',
                letterSpacing: '0.06em',
              }}>{genreMap[id]}</span>
            ))}
          </div>

          <p style={{
            fontSize: '1rem', fontWeight: 700, lineHeight: 1.2,
            color: 'var(--text)',
            transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
            transition: 'transform 0.3s ease',
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>
            {movie.title}
          </p>

          {/* Overview on hover */}
          <div style={{
            maxHeight: hovered ? '52px' : '0px',
            overflow: 'hidden',
            transition: 'max-height 0.3s ease',
          }}>
            <p style={{
              fontSize: '0.74rem', color: 'var(--muted)', marginTop: '0.4rem',
              lineHeight: 1.55,
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

/* ─── Horizontal scroll strip con flechas + drag ─── */
function HScrollStrip({ children, itemWidth = 360 }) {
  const ref        = useRef(null)
  const [canLeft,  setCanLeft]  = useState(false)
  const [canRight, setCanRight] = useState(true)
  const [hovered,  setHovered]  = useState(false)

  // drag state
  const dragging  = useRef(false)
  const startX    = useRef(0)
  const scrollLeft = useRef(0)

  function updateArrows() {
    const el = ref.current
    if (!el) return
    setCanLeft(el.scrollLeft > 8)
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8)
  }

  function scrollBy(dir) {
    const el = ref.current
    if (!el) return
    el.scrollBy({ left: dir * (itemWidth * 2 + 16), behavior: 'smooth' })
  }

  function onMouseDown(e) {
    dragging.current  = true
    startX.current    = e.pageX - ref.current.offsetLeft
    scrollLeft.current = ref.current.scrollLeft
    ref.current.style.cursor = 'grabbing'
    ref.current.style.userSelect = 'none'
  }

  function onMouseMove(e) {
    if (!dragging.current) return
    e.preventDefault()
    const x    = e.pageX - ref.current.offsetLeft
    const walk = (x - startX.current) * 1.2
    ref.current.scrollLeft = scrollLeft.current - walk
  }

  function stopDrag() {
    dragging.current = false
    if (ref.current) {
      ref.current.style.cursor = 'grab'
      ref.current.style.userSelect = ''
    }
  }

  return (
    <div
      style={{ position: 'relative' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Left arrow */}
      <button
        onClick={() => scrollBy(-1)}
        style={{
          position: 'absolute', left: '0.5rem', top: '50%', transform: 'translateY(-50%)',
          zIndex: 10,
          width: '40px', height: '40px', borderRadius: '50%',
          background: 'rgba(18,18,26,0.92)', backdropFilter: 'blur(8px)',
          border: '1px solid rgba(201,168,76,0.3)',
          color: 'var(--accent)', fontSize: '1.1rem', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          opacity: hovered && canLeft ? 1 : 0,
          pointerEvents: hovered && canLeft ? 'all' : 'none',
          transition: 'opacity 0.2s',
          boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
        }}
      >‹</button>

      {/* Scroll container */}
      <div
        ref={ref}
        onScroll={updateArrows}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={stopDrag}
        onMouseLeave={stopDrag}
        className="hide-scrollbar"
        style={{
          display: 'flex', gap: '1rem', overflowX: 'auto',
          padding: '0.5rem 2.5rem 1.5rem',
          cursor: 'grab',
          maskImage: 'linear-gradient(to right, transparent 0%, black 3%, black 93%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 3%, black 93%, transparent 100%)',
        }}
      >
        {children}
      </div>

      {/* Right arrow */}
      <button
        onClick={() => scrollBy(1)}
        style={{
          position: 'absolute', right: '0.5rem', top: '50%', transform: 'translateY(-50%)',
          zIndex: 10,
          width: '40px', height: '40px', borderRadius: '50%',
          background: 'rgba(18,18,26,0.92)', backdropFilter: 'blur(8px)',
          border: '1px solid rgba(201,168,76,0.3)',
          color: 'var(--accent)', fontSize: '1.1rem', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          opacity: hovered && canRight ? 1 : 0,
          pointerEvents: hovered && canRight ? 'all' : 'none',
          transition: 'opacity 0.2s',
          boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
        }}
      >›</button>
    </div>
  )
}

/* ─── Helpers ─── */
function SectionHeader({ label, title, linkHref, linkLabel }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
      <div>
        <p style={{ fontSize: '0.62rem', color: 'var(--accent)', letterSpacing: '0.32em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>{label}</p>
        <h3 className="font-display" style={{ fontSize: '2.4rem', lineHeight: 1 }}>{title}</h3>
      </div>
      {linkHref && (
        <Link href={linkHref} style={{
          fontSize: '0.78rem', color: 'var(--muted)', textDecoration: 'none',
          letterSpacing: '0.1em', textTransform: 'uppercase',
        }}
        onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
        onMouseLeave={e => e.currentTarget.style.color = 'var(--muted)'}
        >{linkLabel} →</Link>
      )}
    </div>
  )
}

function ScrollReveal({ children, delay = 0 }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add('visible'); obs.disconnect() } },
      { threshold: 0.08 }
    )
    const t = setTimeout(() => obs.observe(el), delay)
    return () => { clearTimeout(t); obs.disconnect() }
  }, [delay])
  return <div ref={ref} className="scroll-reveal">{children}</div>
}

const genreMap = {
  28: 'Acción', 12: 'Aventura', 16: 'Animación', 35: 'Comedia',
  80: 'Crimen', 99: 'Documental', 18: 'Drama', 10751: 'Familia',
  14: 'Fantasía', 36: 'Historia', 27: 'Terror', 10402: 'Música',
  9648: 'Misterio', 10749: 'Romance', 878: 'Ciencia ficción',
  10770: 'Película de TV', 53: 'Suspense', 10752: 'Bélica', 37: 'Western',
}
