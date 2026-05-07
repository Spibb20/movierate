import Link from "next/link"
import { Sword, Drama, Ghost, Laugh, Rocket, Heart, ShieldAlert, Clapperboard } from "lucide-react"

const genreIcons = [
  { name: "Action", label: "Action", icon: Sword },
  { name: "Drama", label: "Drama", icon: Drama },
  { name: "Horror", label: "Horror", icon: Ghost },
  { name: "Comedy", label: "Comedy", icon: Laugh },
  { name: "Sci-Fi", label: "Sci-Fi", icon: Rocket },
  { name: "Romance", label: "Romance", icon: Heart },
  { name: "Thriller", label: "Thriller", icon: ShieldAlert },
  { name: "Animation", label: "Animation", icon: Clapperboard },
]

export function GenreGrid() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <h2 className="mb-8 text-xl font-semibold text-foreground">Ангиллаар үзэх</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-8">
        {genreIcons.map((g) => {
          const Icon = g.icon
          return (
            <Link
              key={g.name}
              href={`/movies?genre=${g.name}`}
              className="group flex flex-col items-center gap-2.5 rounded-xl border border-border bg-card p-5 transition-all hover:border-accent/30 hover:shadow-md hover:shadow-accent/5"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/8 transition-colors group-hover:bg-accent/15">
                <Icon className="h-5 w-5 text-accent" />
              </div>
              <span className="text-xs font-medium text-foreground">{g.label}</span>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
