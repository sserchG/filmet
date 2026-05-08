import { getPopular, getTrending, getTopRated } from '@/lib/tmdb'
import PopularClient from '@/components/PopularClient'

export default async function Popular() {
  const [trendData, popularData, topRatedData] = await Promise.all([
    getTrending(),
    getPopular(),
    getTopRated(),
  ])

  return (
    <PopularClient
      trending={trendData.results.slice(0, 20)}
      popular={popularData.results.slice(0, 20)}
      topRated={topRatedData.results.slice(0, 20)}
    />
  )
}
