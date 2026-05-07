import { movies } from "@/lib/data";
import { getMovieById } from "@/lib/api";
import { MovieDetailClient } from "@/components/movie-detail-client";

export async function generateStaticParams() {
  return movies.map((m) => ({ id: m.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const movie = await getMovieById(id);
  if (!movie) return { title: "Not Found" };
  return { title: `${movie.title} - MovieRate.mn`, description: movie.synopsis };
}

export default async function MovieDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const movie = await getMovieById(id);
  return <MovieDetailClient movieData={movie ? JSON.parse(JSON.stringify(movie)) : null} />;
}
