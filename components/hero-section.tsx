import Link from "next/link"
import Image from "next/image"
import { Search, Play, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { movies } from "@/lib/data"

export function HeroSection() {
  const featured = movies[0]

  return (
    <section className="relative overflow-hidden bg-secondary/30">
      {/* Background poster blur */}
      <div className="absolute inset-0 z-0">
        <Image
          src={featured.poster}
          alt=""
          fill
          className="object-cover opacity-[0.07] blur-xl"
          sizes="100vw"
          aria-hidden="true"
          priority
        />
      </div>

      <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-center px-4 py-20 text-center md:py-28">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-4 py-1.5">
          <div className="h-1.5 w-1.5 rounded-full bg-accent" />
          <span className="text-xs font-medium text-accent">Кино мэдээлэл & үнэлгээ</span>
        </div>

        <h1 className="max-w-2xl text-balance text-4xl font-bold leading-tight tracking-tight text-foreground md:text-5xl lg:text-6xl">
          Шилдэг кинонуудыг олж,{" "}
          <span className="text-accent">үнэлгээ</span> өгөөрэй
        </h1>

        <p className="mt-5 max-w-lg text-pretty leading-relaxed text-muted-foreground">
          Шинэ болон сонгодог кинонуудын мэдээлэл, трейлэр, үнэлгээ, сэтгэгдлийг нэг дороос олоорой.
        </p>

        <div className="mt-8 flex items-center gap-3">
          <Link href="/movies">
            <Button className="gap-2 bg-accent text-accent-foreground shadow-md shadow-accent/20 hover:bg-accent/90">
              <Search className="h-4 w-4" />
              Кино хайх
            </Button>
          </Link>
          <Link href="/register">
            <Button variant="outline" className="gap-2 shadow-sm">
              Бүртгүүлэх
            </Button>
          </Link>
        </div>

        {/* Featured movie mini card */}
        <Link
          href={`/movies/${featured.id}`}
          className="group mt-12 flex items-center gap-4 rounded-2xl border border-border bg-card/80 p-3 pr-6 backdrop-blur-sm transition-all hover:shadow-md"
        >
          <div className="relative h-16 w-11 shrink-0 overflow-hidden rounded-lg">
            <Image
              src={featured.poster}
              alt={featured.title}
              fill
              className="object-cover"
              sizes="44px"
            />
          </div>
          <div className="flex flex-col items-start gap-0.5">
            <span className="text-[10px] font-medium uppercase tracking-wider text-accent">Онцлох кино</span>
            <p className="text-sm font-semibold text-foreground">{featured.title}</p>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-accent text-accent" />
                <span className="text-xs text-muted-foreground">{featured.rating}</span>
              </div>
              <span className="text-xs text-muted-foreground">{featured.year}</span>
            </div>
          </div>
          <Play className="ml-2 h-4 w-4 text-muted-foreground transition-colors group-hover:text-accent" />
        </Link>
      </div>
    </section>
  )
}
