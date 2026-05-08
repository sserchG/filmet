export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const page = searchParams.get('page') || '1'

  const res = await fetch(
    `https://api.themoviedb.org/3/movie/now_playing?language=es-ES&region=ES&page=${page}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
    }
  )
  const data = await res.json()
  return Response.json(data)
}
