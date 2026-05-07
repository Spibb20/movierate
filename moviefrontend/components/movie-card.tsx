import Image from "next/image";
import Link from "next/link";
import { Star, Play } from "lucide-react";
import type { Movie } from "@/lib/data";

export function MovieCard({ movie }: { movie: Movie }) {
  return (
    <Link
      href={`/movies/${movie.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all hover:shadow-lg hover:shadow-foreground/5"
    >
      <div className="relative aspect-[2/3] overflow-hidden bg-muted">
        <Image
          src={movie.poster}
          alt={movie.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-foreground/0 transition-all duration-300 group-hover:bg-foreground/20">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/90 opacity-0 transition-all duration-300 group-hover:opacity-100">
            <Play className="h-4 w-4 text-accent-foreground" />
          </div>
        </div>
        <div className="absolute left-2 top-2 flex items-center gap-1 rounded-md bg-card/90 px-1.5 py-0.5 backdrop-blur-sm">
          <Star className="h-3 w-3 fill-accent text-accent" />
          <span className="text-[11px] font-semibold text-foreground">
            {movie.rating}
          </span>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3">
        <h3 className="line-clamp-1 text-sm font-semibold text-foreground">
          {movie.title}
        </h3>
        <p className="line-clamp-1 text-xs text-muted-foreground">
          {movie.titleMn}
        </p>
        <div className="mt-auto flex items-center gap-1.5 pt-1.5">
          {movie.genre.slice(0, 2).map((g) => (
            <span
              key={g}
              className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium text-secondary-foreground"
            >
              {g}
            </span>
          ))}
          <span className="ml-auto text-[11px] text-muted-foreground">
            {movie.year}
          </span>
        </div>
      </div>
    </Link>
  );
}
