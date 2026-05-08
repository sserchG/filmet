'use client'

import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

export default function BuscarPage() {
  const searchParams = useSearchParams()
  const [query,       setQuery]       = useState(searchParams.get('q') || '')
  const [results,     setResults]     = useState([])
  const [loading,     setLoading]     = useState(false)
  const [searched,    setSearched]    = useState(false)
  const [page,        setPage]        = useState(1)
  const [totalPages,  setTotalPages]  = useState(1)
  const [loadingMore, setLoadingMore] = useState(false)
  const debounceRef = useRef(null)

  useEffect(() => {
    if (!query.trim()) { setResults([]); setSearched(false); setPage(1); return }
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      setLoading(true)
      setSearched(true)
      setPage(1)
      const res  = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}&page=1`)
      const data = await res.json()
      setResults(data.results || [])
      setTotalPages(data.total_pages || 1)
      setLoading(false)
    }, 350)
    return () => clearTimeout(debounceRef.current)
  }, [query])

  async function loadMore() {
    const nextPage = page + 1
    setLoadingMore(true)
    const res  = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}&page=${nextPage}`)
    const data = await res.json()
    setResults(prev => [...prev, ...(data.results || [])])
    setPage(nextPage)
    setLoadingMore(false)
  }

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)', paddingTop: '64px' }}>
      <section style={{ padding: '4rem 2.5rem 6rem', maxWidth: '1200px', margin: '0 auto' }}>

        {/* Header */}
        <p style={{ fontSize: '0.62rem', color: 'var(--accent)', letterSpacing: '0.38em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
          Base de datos TMDB
        </p>
        <h1 className="font-display" style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', lineHeight: 0.9, marginBottom: '2.5rem' }}>
          Buscar películas
        </h1>

        {/* Search input */}
        <div style={{ position: 'relative', marginBottom: '3rem', maxWidth: '640px' }}>
          <span style={{
            position: 'absolute', left: '1.1rem', top: '50%', transform: 'translateY(-50%)',
            color: 'var(--muted)', fontSize: '1rem', pointerEvents: 'none',
          }}>⌕</span>
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Título, director, saga..."
            autoFocus
            style={{
              width: '100%',
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              padding: '1rem 3.5rem 1rem 2.8rem',
              color: 'var(--text)',
              fontSize: '1rem', outline: 'none',
              boxSizing: 'border-box',
              transition: 'border-color 0.2s',
            }}
            onFocus={e => e.target.style.borderColor = 'rgba(201,168,76,0.4)'}
            onBlur={e => e.target.style.borderColor = 'var(--border)'}
          />
          {loading && (
            <span style={{
              position: 'absolute', right: '1.1rem', top: '50%', transform: 'translateY(-50%)',
              color: 'var(--muted)', fontSize: '0.75rem', letterSpacing: '0.1em',
            }}>···</span>
          )}
          {query && !loading && (
            <button onClick={() => setQuery('')} style={{
              position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)',
              background: 'none', border: 'none', color: 'var(--muted)',
              fontSize: '1rem', cursor: 'pointer', padding: '0.25rem',
            }}>✕</button>
          )}
        </div>

        {/* Empty state */}
        {!searched && !loading && (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--muted)' }}>
            <div className="font-display" style={{ fontSize: '4rem', opacity: 0.1, marginBottom: '1rem' }}>⌕</div>
            <p style={{ fontSize: '0.9rem' }}>Escribe para buscar entre millones de películas</p>
          </div>
        )}

        {/* No results */}
        {searched && !loading && results.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <p style={{ color: 'var(--muted)', fontSize: '1rem' }}>
              Sin resultados para <span style={{ color: 'var(--text)', fontWeight: 600 }}>"{query}"</span>
            </p>
            <p style={{ color: 'var(--muted)', fontSize: '0.85rem', marginTop: '0.5rem', opacity: 0.7 }}>
              Prueba con otro título o en inglés
            </p>
          </div>
        )}

        {/* Results count */}
        {results.length > 0 && (
          <p style={{ fontSize: '0.72rem', color: 'var(--muted)', letterSpacing: '0.08em', marginBottom: '1.5rem' }}>
            {results.length} resultado{results.length !== 1 ? 's' : ''} para <span style={{ color: 'var(--text)' }}>"{query}"</span>
          </p>
        )}

        {/* Results grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))',
          gap: '1.5rem',
        }}>
          {results.map((movie, i) => (
            <Link key={movie.id} href={`/movie/${movie.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block', animation: `scaleIn 0.3s ease ${0.03 * i}s both` }}>
              <div>
                <div style={{
                  position: 'relative', aspectRatio: '2/3',
                  borderRadius: '10px', overflow: 'hidden',
                  background: 'var(--surface2)',
                  transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.7)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none' }}
                >
                  {movie.poster_path ? (
                    <Image
                      src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`}
                      alt={movie.title} fill sizes="180px"
                      style={{ objectFit: 'cover' }}
                    />
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--muted)', fontSize: '0.75rem', padding: '1rem', textAlign: 'center' }}>
                      {movie.title}
                    </div>
                  )}
                  {movie.vote_average > 0 && (
                    <div style={{
                      position: 'absolute', top: '7px', right: '7px',
                      background: 'rgba(10,10,15,0.85)', backdropFilter: 'blur(6px)',
                      padding: '2px 7px', borderRadius: '5px',
                      fontSize: '0.7rem', fontWeight: 600, color: 'var(--accent)',
                      border: '1px solid rgba(201,168,76,0.18)',
                    }}>★ {movie.vote_average.toFixed(1)}</div>
                  )}
                </div>
                <p style={{ marginTop: '0.6rem', fontSize: '0.83rem', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {movie.title}
                </p>
                <p style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>
                  {movie.release_date?.slice(0, 4)}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {results.length > 0 && page < totalPages && (
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
