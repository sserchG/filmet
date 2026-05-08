import { getNowPlaying } from '@/lib/tmdb'
import CartelaClient from '@/components/CartelaClient'

export default async function Cartelera() {
  const data = await getNowPlaying()
  return <CartelaClient movies={data.results} totalPages={data.total_pages || 1} />
}
