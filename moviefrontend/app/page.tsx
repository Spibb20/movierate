import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { HeroSection } from "@/components/hero-section"
import { GenreGrid } from "@/components/genre-grid"
import { MovieCard } from "@/components/movie-card"
import { movies, getTopRated } from "@/lib/data"

export default function Page() {
  const topRated = getTopRated(4)
  const newMovies = movies.filter((m) => m.year === 2024).slice(0, 4)

  return (
    <>
      <HeroSection />

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-6 w-1 rounded-full bg-accent" />
            <h2 className="text-xl font-bold text-foreground">Шинэ кино</h2>
          </div>
          <Link
            href="/movies"
            className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium text-accent transition-colors hover:bg-accent/10"
          >
            Бүгдийг үзэх
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {newMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4">
        <div className="border-t border-border" />
      </div>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-6 w-1 rounded-full bg-accent" />
            <h2 className="text-xl font-bold text-foreground">Өндөр үнэлгээтэй</h2>
          </div>
          <Link
            href="/movies"
            className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium text-accent transition-colors hover:bg-accent/10"
          >
            Бүгдийг үзэх
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {topRated.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </section>

      <GenreGrid />
    </>
  )
}
