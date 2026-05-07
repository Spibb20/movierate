"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Clock,
  Star,
  Bookmark,
  Play,
  Calendar,
  UserRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReviewSection } from "@/components/review-section";
import { PaymentModal } from "@/components/payment-modal";
import { useRentals } from "@/lib/rental-store";
import type { Movie } from "@/lib/data";

export function MovieDetailClient({ movieData }: { movieData: Movie | null }) {
  const [paymentOpen, setPaymentOpen] = useState(false);
  const { rentMovie, isRented, getRemainingTime } = useRentals();

  if (!movieData) notFound();
  const movie = movieData;

  const rented = isRented(movie.id);
  const remaining = getRemainingTime(movie.id);

  function handleRentalSuccess() {
    rentMovie(movie.id);
    setPaymentOpen(false);
  }

  return (
    <>
      <div className="relative h-48 overflow-hidden bg-secondary/60 md:h-64">
        <Image
          src={movie.poster}
          alt=""
          fill
          className="object-cover opacity-20 blur-2xl"
          sizes="100vw"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" />
      </div>

      <div className="mx-auto max-w-6xl px-4">
        <div className="-mt-24 relative z-10">
          <Link
            href="/movies"
            className="mb-4 inline-flex items-center gap-1.5 rounded-lg bg-card/80 px-3 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur-sm transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-3 w-3" />
            Буцах
          </Link>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-[260px_1fr]">
            <div className="relative aspect-[2/3] overflow-hidden rounded-2xl border border-border bg-muted shadow-lg">
              <Image
                src={movie.poster}
                alt={movie.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 260px"
                priority
              />
            </div>

            <div className="flex flex-col gap-5 pt-2">
              <div>
                <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                  {movie.title}
                </h1>
                <p className="mt-1 text-lg text-muted-foreground">
                  {movie.titleMn}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1.5 rounded-lg bg-accent/10 px-3 py-1.5">
                  <Star className="h-4 w-4 fill-accent text-accent" />
                  <span className="text-sm font-semibold text-accent">
                    {movie.rating}/5
                  </span>
                </div>
                <div className="flex items-center gap-1.5 rounded-lg bg-secondary px-3 py-1.5">
                  <span className="text-xs font-medium text-muted-foreground">
                    IMDb
                  </span>
                  <span className="text-sm font-semibold text-foreground">
                    {movie.imdb}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 rounded-lg bg-secondary px-3 py-1.5">
                  <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-sm text-foreground">
                    {movie.duration}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 rounded-lg bg-secondary px-3 py-1.5">
                  <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-sm text-foreground">{movie.year}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {movie.genre.map((g) => (
                  <Link
                    key={g}
                    href={`/movies?genre=${g}`}
                    className="rounded-full border border-border bg-card px-3.5 py-1 text-xs font-medium text-secondary-foreground transition-colors hover:border-accent/30 hover:text-accent"
                  >
                    {g}
                  </Link>
                ))}
              </div>

              <div className="rounded-xl bg-secondary/40 p-4">
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Тойм
                </h3>
                <p className="text-sm leading-relaxed text-foreground/80">
                  {movie.synopsis}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary">
                    <UserRound className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">
                      Найруулагч
                    </p>
                    <p className="text-sm font-medium text-foreground">
                      {movie.director}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary">
                    <UserRound className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">
                      Жүжигчид
                    </p>
                    <p className="text-sm font-medium text-foreground">
                      {movie.cast.join(", ")}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {rented ? (
                  <div className="flex items-center gap-3">
                    <Button className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90">
                      <Play className="h-4 w-4" />
                      Үзэх
                    </Button>
                    {remaining && (
                      <span className="flex items-center gap-1.5 rounded-lg bg-accent/10 px-3 py-1.5 text-xs font-medium text-accent">
                        <Clock className="h-3 w-3" />
                        {remaining} үлдсэн
                      </span>
                    )}
                  </div>
                ) : (
                  <Button
                    onClick={() => setPaymentOpen(true)}
                    className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90"
                  >
                    <Play className="h-4 w-4" />
                    Түрээслэх &middot; 4,900&#8366;
                  </Button>
                )}
                <Button variant="outline" className="gap-2">
                  <Bookmark className="h-4 w-4" />
                  Хадгалах
                </Button>
              </div>
            </div>
          </div>
        </div>

        <section className="mt-14 pb-4">
          <h2 className="mb-4 text-lg font-semibold text-foreground">
            Трейлэр
          </h2>
          <div className="aspect-video overflow-hidden rounded-2xl border border-border bg-muted shadow-sm">
            <iframe
              src={movie.trailer}
              title={`${movie.title} trailer`}
              className="h-full w-full"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          </div>
        </section>

        <div className="pb-16 pt-6">
          <ReviewSection reviews={movie.reviews} />
        </div>
      </div>

      <PaymentModal
        movie={movie}
        open={paymentOpen}
        onClose={() => setPaymentOpen(false)}
        onSuccess={handleRentalSuccess}
      />
    </>
  );
}
