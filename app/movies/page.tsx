import { Suspense } from "react"
import { movies } from "@/lib/data"
import { MovieCard } from "@/components/movie-card"
import { MoviesFilter } from "@/components/movies-filter"

export const metadata = {
  title: "Кино жагсаалт - MovieRate.mn",
  description: "Бүх кинонуудын жагсаалт, ангиллаар шүүх, хайх.",
}

function MoviesGrid({
  searchParams,
}: {
  searchParams: { genre?: string; year?: string; q?: string }
}) {
  let filtered = [...movies]

  if (searchParams.genre) {
    filtered = filtered.filter((m) => m.genre.includes(searchParams.genre!))
  }

  if (searchParams.year) {
    filtered = filtered.filter((m) => m.year === Number(searchParams.year))
  }

  if (searchParams.q) {
    const q = searchParams.q.toLowerCase()
    filtered = filtered.filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        m.titleMn.toLowerCase().includes(q) ||
        m.director.toLowerCase().includes(q)
    )
  }

  if (filtered.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-lg font-medium text-foreground">Кино олдсонгүй</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Өөр хайлт эсвэл шүүлтүүр ашиглана уу.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {filtered.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  )
}

export default async function MoviesPage({
  searchParams,
}: {
  searchParams: Promise<{ genre?: string; year?: string; q?: string }>
}) {
  const params = await searchParams

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-semibold text-foreground">
        Кино жагсаалт
      </h1>

      <Suspense fallback={null}>
        <MoviesFilter />
      </Suspense>

      <div className="mt-8">
        <MoviesGrid searchParams={params} />
      </div>
    </div>
  )
}
