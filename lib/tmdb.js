const BASE_URL = 'https://api.themoviedb.org/3'
const TOKEN = process.env.TMDB_ACCESS_TOKEN

const options = {
  headers: {
    Authorization: `Bearer ${TOKEN}`,
    'Content-Type': 'application/json',
  },
}

export async function getNowPlaying() {
  const res = await fetch(`${BASE_URL}/movie/now_playing?language=es-ES&region=ES`, options)
  return res.json()
}

export async function getMovieDetails(id) {
  const res = await fetch(`${BASE_URL}/movie/${id}?language=es-ES`, options)
  return res.json()
}

export async function searchMovies(query) {
  const res = await fetch(`${BASE_URL}/search/movie?query=${query}&language=es-ES`, options)
  return res.json()
}

export async function getPopular() {
  const res = await fetch(`${BASE_URL}/movie/popular?language=es-ES&region=ES`, options)
  return res.json()
}

export async function getTrending() {
  const res = await fetch(`${BASE_URL}/trending/movie/week?language=es-ES`, options)
  return res.json()
}

export async function getUpcoming() {
  const res = await fetch(`${BASE_URL}/movie/upcoming?language=es-ES&region=ES`, options)
  return res.json()
}

export async function getTopRated() {
  const res = await fetch(`${BASE_URL}/movie/top_rated?language=es-ES`, options)
  return res.json()
}

export async function getMovieVideos(id) {
  const res = await fetch(`${BASE_URL}/movie/${id}/videos?language=es-ES`, options)
  return res.json()
}

export async function getWatchProviders(id) {
  const res = await fetch(`${BASE_URL}/movie/${id}/watch/providers`, options)
  return res.json()
}

export async function getSimilarMovies(id) {
  const res = await fetch(`${BASE_URL}/movie/${id}/similar?language=es-ES`, options)
  return res.json()
}

export async function getMovieCredits(id) {
  const res = await fetch(`${BASE_URL}/movie/${id}/credits?language=es-ES`, options)
  return res.json()
}