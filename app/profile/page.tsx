"use client"

import { useState } from "react"
import Link from "next/link"
import { User, LogOut, Heart, Settings, Shield, PlayCircle, Clock } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MovieCard } from "@/components/movie-card"
import { movies } from "@/lib/data"
import { useRentals } from "@/lib/rental-store"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const demoUser = {
  name: "Bat-Erdene",
  email: "baterdene@example.com",
  role: "user" as const,
  favorites: ["1", "4"],
}

export default function ProfilePage() {
  const [user, setUser] = useState(demoUser)
  const [name, setName] = useState(user.name)
  const [saved, setSaved] = useState(false)
  const { rentals, getRemainingTime } = useRentals()

  const favoriteMovies = movies.filter((m) => user.favorites.includes(m.id))

  const activeRentals = rentals.filter((r) => r.expiresAt > Date.now())
  const rentedMovies = movies.filter((m) =>
    activeRentals.some((r) => r.movieId === m.id)
  )

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setUser({ ...user, name })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      {/* Profile header */}
      <div className="mb-8 flex items-center gap-4 rounded-2xl border border-border bg-card p-6">
        <Avatar className="h-16 w-16 bg-accent/10">
          <AvatarFallback className="bg-accent/10 text-lg font-semibold text-accent">
            {user.name.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-bold text-foreground">{user.name}</h1>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
      </div>

      <Tabs defaultValue="rentals" className="w-full">
        <TabsList className="mb-6 bg-secondary/60">
          <TabsTrigger value="rentals" className="gap-1.5">
            <PlayCircle className="h-3.5 w-3.5" />
            Миний түрээсэлсэн
          </TabsTrigger>
          <TabsTrigger value="favorites" className="gap-1.5">
            <Heart className="h-3.5 w-3.5" />
            Хадгалсан
          </TabsTrigger>
          <TabsTrigger value="settings" className="gap-1.5">
            <Settings className="h-3.5 w-3.5" />
            Тохиргоо
          </TabsTrigger>
        </TabsList>

        {/* Rentals tab */}
        <TabsContent value="rentals">
          {rentedMovies.length === 0 ? (
            <div className="flex flex-col items-center rounded-2xl border border-dashed border-border py-16 text-center">
              <PlayCircle className="mb-3 h-8 w-8 text-muted-foreground" />
              <p className="text-sm font-medium text-foreground">Түрээсэлсэн кино байхгүй</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Кино түрээслэхийн тулд кино дэлгэрэнгүй хуудас руу орно уу.
              </p>
              <Link href="/movies" className="mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5"
                >
                  Кино үзэх
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {rentedMovies.map((movie) => {
                const remaining = getRemainingTime(movie.id)
                return (
                  <div key={movie.id} className="flex flex-col gap-2">
                    <MovieCard movie={movie} />
                    <div className="flex items-center gap-1.5 rounded-lg bg-accent/10 px-2.5 py-1.5">
                      <Clock className="h-3 w-3 text-accent" />
                      <span className="text-[11px] font-medium text-accent">
                        {remaining} үлдсэн
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </TabsContent>

        {/* Favorites tab */}
        <TabsContent value="favorites">
          {favoriteMovies.length === 0 ? (
            <div className="flex flex-col items-center rounded-2xl border border-dashed border-border py-16 text-center">
              <Heart className="mb-3 h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Хадгалсан кино байхгүй байна.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {favoriteMovies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Settings tab */}
        <TabsContent value="settings">
          <div className="max-w-md rounded-2xl border border-border bg-card p-6">
            <form onSubmit={handleSave} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label className="text-sm text-foreground">Нэр</Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-background"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label className="text-sm text-foreground">И-мэйл</Label>
                <Input value={user.email} disabled className="bg-muted" />
              </div>
              <div className="flex items-center gap-3">
                <Button
                  type="submit"
                  className="bg-accent text-accent-foreground hover:bg-accent/90"
                >
                  Хадгалах
                </Button>
                {saved && (
                  <span className="text-sm text-accent">Амжилттай!</span>
                )}
              </div>
            </form>

            <div className="mt-6 flex flex-col gap-3 border-t border-border pt-5">
              <Link href="/admin">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Shield className="h-4 w-4" />
                  Админ хуудас
                </Button>
              </Link>
              <Link href="/">
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2 text-destructive hover:text-destructive"
                >
                  <LogOut className="h-4 w-4" />
                  Гарах
                </Button>
              </Link>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
