"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  ArrowLeft,
  Plus,
  Pencil,
  Trash2,
  Star,
  MessageSquare,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { movies as initialMovies, type Movie, type Review } from "@/lib/data"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

function MovieForm({
  movie,
  onSave,
  onCancel,
}: {
  movie?: Movie
  onSave: (data: Partial<Movie>) => void
  onCancel: () => void
}) {
  const [title, setTitle] = useState(movie?.title || "")
  const [titleMn, setTitleMn] = useState(movie?.titleMn || "")
  const [year, setYear] = useState(movie?.year || 2024)
  const [genre, setGenre] = useState(movie?.genre.join(", ") || "")
  const [director, setDirector] = useState(movie?.director || "")
  const [duration, setDuration] = useState(movie?.duration || "")
  const [synopsis, setSynopsis] = useState(movie?.synopsis || "")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSave({
      title,
      titleMn,
      year,
      genre: genre.split(",").map((g) => g.trim()),
      director,
      duration,
      synopsis,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label className="text-sm text-foreground">Нэр (English)</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} required className="bg-card" />
        </div>
        <div className="flex flex-col gap-2">
          <Label className="text-sm text-foreground">Нэр (Монгол)</Label>
          <Input value={titleMn} onChange={(e) => setTitleMn(e.target.value)} required className="bg-card" />
        </div>
        <div className="flex flex-col gap-2">
          <Label className="text-sm text-foreground">Он</Label>
          <Input type="number" value={year} onChange={(e) => setYear(Number(e.target.value))} className="bg-card" />
        </div>
        <div className="flex flex-col gap-2">
          <Label className="text-sm text-foreground">Хугацаа</Label>
          <Input value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="2h 15min" className="bg-card" />
        </div>
        <div className="flex flex-col gap-2">
          <Label className="text-sm text-foreground">Найруулагч</Label>
          <Input value={director} onChange={(e) => setDirector(e.target.value)} className="bg-card" />
        </div>
        <div className="flex flex-col gap-2">
          <Label className="text-sm text-foreground">Ангилал (таслалаар)</Label>
          <Input value={genre} onChange={(e) => setGenre(e.target.value)} placeholder="Action, Drama" className="bg-card" />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Label className="text-sm text-foreground">Тойм</Label>
        <Textarea value={synopsis} onChange={(e) => setSynopsis(e.target.value)} className="min-h-[80px] bg-card" />
      </div>
      <div className="flex items-center gap-2">
        <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
          Хадгалах
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Болих
        </Button>
      </div>
    </form>
  )
}

export default function AdminPage() {
  const [movieList, setMovieList] = useState<Movie[]>(initialMovies)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showAdd, setShowAdd] = useState(false)

  function handleDelete(id: string) {
    setMovieList((prev) => prev.filter((m) => m.id !== id))
  }

  function handleDeleteReview(movieId: string, reviewId: string) {
    setMovieList((prev) =>
      prev.map((m) =>
        m.id === movieId
          ? { ...m, reviews: m.reviews.filter((r) => r.id !== reviewId) }
          : m
      )
    )
  }

  function handleSaveEdit(id: string, data: Partial<Movie>) {
    setMovieList((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...data } : m))
    )
    setEditingId(null)
  }

  function handleAdd(data: Partial<Movie>) {
    const newMovie: Movie = {
      id: String(Date.now()),
      title: data.title || "Untitled",
      titleMn: data.titleMn || "",
      year: data.year || 2024,
      genre: data.genre || [],
      rating: 0,
      imdb: 0,
      duration: data.duration || "",
      director: data.director || "",
      cast: [],
      synopsis: data.synopsis || "",
      poster: "/movies/stellar-odyssey.jpg",
      trailer: "",
      reviews: [],
    }
    setMovieList((prev) => [newMovie, ...prev])
    setShowAdd(false)
  }

  const allReviews = movieList.flatMap((m) =>
    m.reviews.map((r) => ({ ...r, movieId: m.id, movieTitle: m.title }))
  )

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <Link
        href="/profile"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Профайл руу буцах
      </Link>

      <h1 className="mb-6 text-2xl font-semibold text-foreground">
        Админ удирдлага
      </h1>

      <Tabs defaultValue="movies" className="w-full">
        <TabsList className="mb-6 bg-secondary">
          <TabsTrigger value="movies" className="gap-1.5">
            <Star className="h-3.5 w-3.5" />
            Кинонууд
          </TabsTrigger>
          <TabsTrigger value="reviews" className="gap-1.5">
            <MessageSquare className="h-3.5 w-3.5" />
            Сэтгэгдлүүд
          </TabsTrigger>
        </TabsList>

        <TabsContent value="movies">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Нийт {movieList.length} кино
            </p>
            <Button
              onClick={() => setShowAdd(!showAdd)}
              size="sm"
              className="gap-1.5 bg-accent text-accent-foreground hover:bg-accent/90"
            >
              {showAdd ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              {showAdd ? "Болих" : "Кино нэмэх"}
            </Button>
          </div>

          {showAdd && (
            <div className="mb-6 rounded-lg border border-border bg-card p-5">
              <h3 className="mb-4 text-sm font-medium text-foreground">
                Шинэ кино нэмэх
              </h3>
              <MovieForm onSave={handleAdd} onCancel={() => setShowAdd(false)} />
            </div>
          )}

          <div className="flex flex-col gap-3">
            {movieList.map((movie) => (
              <div
                key={movie.id}
                className="rounded-lg border border-border bg-card p-4"
              >
                {editingId === movie.id ? (
                  <MovieForm
                    movie={movie}
                    onSave={(data) => handleSaveEdit(movie.id, data)}
                    onCancel={() => setEditingId(null)}
                  />
                ) : (
                  <div className="flex items-center gap-4">
                    <div className="relative h-16 w-11 shrink-0 overflow-hidden rounded bg-muted">
                      <Image
                        src={movie.poster}
                        alt={movie.title}
                        fill
                        className="object-cover"
                        sizes="44px"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-foreground">
                        {movie.title}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {movie.year} &middot; {movie.genre.join(", ")}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingId(movie.id)}
                        className="h-8 w-8 p-0"
                        aria-label="Edit"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                            aria-label="Delete"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Кино устгах</DialogTitle>
                          </DialogHeader>
                          <p className="text-sm text-muted-foreground">
                            &ldquo;{movie.title}&rdquo; киног устгахдаа итгэлтэй байна уу?
                          </p>
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDelete(movie.id)}
                            >
                              Устгах
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="reviews">
          <p className="mb-4 text-sm text-muted-foreground">
            Нийт {allReviews.length} сэтгэгдэл
          </p>
          <div className="flex flex-col gap-3">
            {allReviews.map((review) => (
              <div
                key={review.id}
                className="flex items-start gap-3 rounded-lg border border-border bg-card p-4"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">
                      {review.user}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {review.movieTitle}
                    </span>
                    <span className="text-xs text-muted-foreground">{review.date}</span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{review.comment}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 shrink-0 p-0 text-destructive hover:text-destructive"
                  onClick={() => handleDeleteReview(review.movieId, review.id)}
                  aria-label="Delete review"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
