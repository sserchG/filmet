import { getNowPlaying, getTrending, getUpcoming } from '@/lib/tmdb'
import HomeClient from '@/components/HomeClient'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const [nowData, trendData, upData] = await Promise.all([
    getNowPlaying(),
    getTrending(),
    getUpcoming(),
  ])

  const movies    = nowData?.results || []
  const trending  = trendData?.results?.slice(0, 10) || []
  const upcoming  = upData?.results?.filter(m => m.poster_path).slice(0, 10) || []
  const hero      = trending.find(m => m.backdrop_path) || movies[0]

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)' }}>
      <HomeClient movies={movies} trending={trending} upcoming={upcoming} hero={hero} />
    </main>
  )
}
