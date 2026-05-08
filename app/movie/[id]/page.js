import { getMovieDetails, getMovieVideos, getWatchProviders, getSimilarMovies, getMovieCredits } from '@/lib/tmdb'
import Image from 'next/image'
import Link from 'next/link'
import MovieActions from '@/components/MovieActions'
import Reviews from '@/components/Reviews'
import TrailerButton from '@/components/TrailerButton'
import SimilarMovies from '@/components/SimilarMovies'

export async function generateMetadata({ params }) {
  const { id } = await params
  try {
    const movie = await getMovieDetails(id)
    if (!movie?.title) return { title: 'Película | Filmet' }
    const description = movie.overview?.slice(0, 155) || 'Sin sinopsis disponible.'
    const image = movie.backdrop_path
      ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
      : movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : null
    return {
      title: movie.title,
      description,
      openGraph: {
        title: `${movie.title} | Filmet`,
        description,
        images: image ? [{ url: image, width: 1280, height: 720, alt: movie.title }] : [],
        type: 'article',
      },
      twitter: {
        card: 'summary_large_image',
        title: movie.title,
        description,
        images: image ? [image] : [],
      },
    }
  } catch {
    return { title: 'Película | Filmet' }
  }
}

export default async function MoviePage({ params }) {
  const { id } = await params

  const [movie, videosData, providersData, similarData, creditsData] = await Promise.all([
    getMovieDetails(id),
    getMovieVideos(id),
    getWatchProviders(id),
    getSimilarMovies(id),
    getMovieCredits(id),
  ])

  // Trailer: prefer ES, fallback to any YouTube trailer
  const videos = videosData.results || []
  const trailer =
    videos.find(v => v.type === 'Trailer' && v.site === 'YouTube' && v.iso_639_1 === 'es') ||
    videos.find(v => v.type === 'Trailer' && v.site === 'YouTube') ||
    videos.find(v => v.site === 'YouTube')

  // Watch providers: prefer ES, fallback US
  const providers = providersData.results?.ES || providersData.results?.US || null
  const streaming = providers?.flatrate || []
  const rent      = providers?.rent || []
  const buy       = providers?.buy || []
  const hasProviders = streaming.length > 0 || rent.length > 0 || buy.length > 0

  // Similar movies
  const similar = (similarData.results || [])
    .filter(m => m.poster_path || m.backdrop_path)
    .slice(0, 14)

  // Cast
  const cast = (creditsData.cast || []).slice(0, 12)

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)' }}>

      {/* Backdrop */}
      {movie.backdrop_path && (
        <div style={{ position: 'relative', height: '520px', overflow: 'hidden' }}>
          <Image
            src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
            alt={movie.title} fill sizes="100vw"
            style={{ objectFit: 'cover', objectPosition: 'center 20%' }} priority
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, var(--bg) 0%, rgba(10,10,15,0.6) 50%, rgba(10,10,15,0.25) 100%)' }}/>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(10,10,15,0.5) 0%, transparent 60%)' }}/>
        </div>
      )}

      {/* Content */}
      <section style={{
        maxWidth: '960px', margin: '0 auto',
        padding: '0 2rem 4rem',
        marginTop: movie.backdrop_path ? '-200px' : '5rem',
        position: 'relative',
      }}>

        {/* Poster + Info row */}
        <div className="movie-detail-flex" style={{ display: 'flex', gap: '2.5rem', alignItems: 'flex-end', marginBottom: '3rem' }}>

          {/* Poster */}
          {movie.poster_path && (
            <div className="movie-detail-poster" style={{
              position: 'relative', width: '200px', height: '300px',
              flexShrink: 0, borderRadius: '14px', overflow: 'hidden',
              boxShadow: '0 30px 70px rgba(0,0,0,0.85), 0 0 0 1px rgba(255,255,255,0.07)',
            }}>
              <Image
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title} fill sizes="200px"
                style={{ objectFit: 'cover' }}
              />
            </div>
          )}

          {/* Info */}
          <div style={{ flex: 1, paddingBottom: '0.5rem' }}>
            <p style={{ fontSize: '0.65rem', color: 'var(--accent)', letterSpacing: '0.28em', textTransform: 'uppercase', marginBottom: '0.65rem' }}>
              {movie.release_date?.slice(0, 4)}
              {movie.runtime ? ` · ${movie.runtime} min` : ''}
              {movie.original_language ? ` · ${movie.original_language.toUpperCase()}` : ''}
            </p>

            <h1 className="font-display" style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.5rem)', lineHeight: 0.92, marginBottom: '1rem' }}>
              {movie.title}
            </h1>

            {movie.tagline && (
              <p style={{ color: 'var(--muted)', fontSize: '0.88rem', fontStyle: 'italic', marginBottom: '1rem', opacity: 0.8 }}>
                "{movie.tagline}"
              </p>
            )}

            {/* Genres */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.2rem' }}>
              {movie.genres?.map(g => (
                <span key={g.id} style={{
                  border: '1px solid var(--border)', color: 'var(--muted)',
                  fontSize: '0.72rem', padding: '0.2rem 0.7rem',
                  borderRadius: '20px', letterSpacing: '0.04em',
                }}>{g.name}</span>
              ))}
            </div>

            {/* Rating */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
              <span style={{ color: 'var(--accent)', fontSize: '1.5rem', fontWeight: 700 }}>★ {movie.vote_average?.toFixed(1)}</span>
              <span style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>/ 10</span>
              <span style={{ color: 'var(--border)', fontSize: '0.8rem' }}>·</span>
              <span style={{ color: 'var(--muted)', fontSize: '0.78rem' }}>{movie.vote_count?.toLocaleString()} votos</span>
            </div>

            {/* Actions + Trailer */}
            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <MovieActions movie={movie} />
              <TrailerButton trailerKey={trailer?.key} />
            </div>
          </div>
        </div>

        {/* Watch Providers */}
        {hasProviders && (
          <div style={{ marginBottom: '3rem', padding: '1.4rem 1.6rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '14px' }}>
            <h3 style={{ fontSize: '0.7rem', color: 'var(--accent)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1.2rem' }}>
              ¿Dónde verla?
            </h3>
            {streaming.length > 0 && (
              <ProviderRow label="Streaming" items={streaming} />
            )}
            {rent.length > 0 && (
              <ProviderRow label="Alquilar" items={rent} />
            )}
            {buy.length > 0 && (
              <ProviderRow label="Comprar" items={buy} />
            )}
            <p style={{ fontSize: '0.62rem', color: 'var(--muted)', marginTop: '1rem', opacity: 0.6 }}>
              Disponibilidad en España · Datos de JustWatch vía TMDB
            </p>
          </div>
        )}

        {/* Sinopsis */}
        <div style={{ marginBottom: '3rem', borderTop: '1px solid var(--border)', paddingTop: '2rem' }}>
          <h3 style={{ fontSize: '0.75rem', color: 'var(--accent)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1rem' }}>
            Sinopsis
          </h3>
          <p style={{ color: 'var(--muted)', lineHeight: 1.85, fontSize: '0.97rem' }}>
            {movie.overview || 'Sin sinopsis disponible.'}
          </p>
        </div>

        {/* Cast */}
        {cast.length > 0 && (
          <div style={{ marginBottom: '3rem', borderTop: '1px solid var(--border)', paddingTop: '2rem' }}>
            <h3 style={{ fontSize: '0.75rem', color: 'var(--accent)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
              Reparto principal
            </h3>
            <div style={{ display: 'flex', gap: '0.85rem', overflowX: 'auto', paddingBottom: '0.5rem', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {cast.map(person => (
                <div key={person.cast_id ?? person.id} style={{ flexShrink: 0, width: '88px', textAlign: 'center' }}>
                  <div style={{
                    width: '88px', height: '88px', borderRadius: '50%', overflow: 'hidden',
                    background: 'var(--surface2)', border: '1px solid var(--border)',
                    marginBottom: '0.5rem',
                  }}>
                    {person.profile_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w185${person.profile_path}`}
                        alt={person.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', color: 'var(--muted)' }}>
                        ◎
                      </div>
                    )}
                  </div>
                  <p style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text)', lineHeight: 1.2, marginBottom: '0.15rem', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                    {person.name}
                  </p>
                  <p style={{ fontSize: '0.65rem', color: 'var(--muted)', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical' }}>
                    {person.character}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Similar movies */}
        <SimilarMovies movies={similar} />

        {/* Reviews */}
        <Reviews movieId={movie.id} />
      </section>
    </main>
  )
}

function ProviderRow({ label, items }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem', marginBottom: '0.9rem', flexWrap: 'wrap' }}>
      <span style={{ fontSize: '0.68rem', color: 'var(--muted)', minWidth: '68px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{label}</span>
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {items.slice(0, 8).map(p => (
          <div key={p.provider_id} title={p.provider_name} style={{
            width: '40px', height: '40px', borderRadius: '8px', overflow: 'hidden',
            border: '1px solid var(--border)', flexShrink: 0,
            background: 'var(--surface2)',
          }}>
            <img
              src={`https://image.tmdb.org/t/p/original${p.logo_path}`}
              alt={p.provider_name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
