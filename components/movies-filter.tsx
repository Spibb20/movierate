"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Search } from "lucide-react"
import { genres } from "@/lib/data"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function MoviesFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const activeGenre = searchParams.get("genre") || ""
  const activeYear = searchParams.get("year") || ""
  const searchQuery = searchParams.get("q") || ""

  function updateParams(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`/movies?${params.toString()}`)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Кино хайх..."
          defaultValue={searchQuery}
          onChange={(e) => updateParams("q", e.target.value)}
          className="pl-9 bg-card"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          variant={activeGenre === "" ? "default" : "outline"}
          size="sm"
          onClick={() => updateParams("genre", "")}
          className={activeGenre === "" ? "bg-primary text-primary-foreground" : ""}
        >
          Бүгд
        </Button>
        {genres.map((genre) => (
          <Button
            key={genre}
            variant={activeGenre === genre ? "default" : "outline"}
            size="sm"
            onClick={() => updateParams("genre", genre)}
            className={activeGenre === genre ? "bg-primary text-primary-foreground" : ""}
          >
            {genre}
          </Button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          variant={activeYear === "" ? "secondary" : "ghost"}
          size="sm"
          onClick={() => updateParams("year", "")}
        >
          Бүх он
        </Button>
        {[2024, 2023, 2022].map((year) => (
          <Button
            key={year}
            variant={activeYear === String(year) ? "secondary" : "ghost"}
            size="sm"
            onClick={() => updateParams("year", String(year))}
          >
            {year}
          </Button>
        ))}
      </div>
    </div>
  )
}
