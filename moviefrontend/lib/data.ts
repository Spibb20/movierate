import moviesData from "@/data/movies.json";
import genresData from "@/data/genres.json";

export type Review = {
  id: string;
  user: string;
  avatar: string;
  rating: number;
  comment: string;
  date: string;
};

export type Movie = {
  id: string;
  title: string;
  titleMn: string;
  year: number;
  genre: string[];
  rating: number;
  imdb: number;
  duration: string;
  director: string;
  cast: string[];
  synopsis: string;
  poster: string;
  trailer: string;
  reviews: Review[];
};

export const genres = genresData as readonly string[];
export const movies = moviesData as Movie[];

export function getMovieById(id: string): Movie | undefined {
  return movies.find((m) => m.id === id);
}

export function getMoviesByGenre(genre: string): Movie[] {
  return movies.filter((m) => m.genre.includes(genre));
}

export function getTopRated(limit = 4): Movie[] {
  return [...movies].sort((a, b) => b.rating - a.rating).slice(0, limit);
}
