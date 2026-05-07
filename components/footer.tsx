import Link from "next/link"
import { Film } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border bg-secondary/50">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="flex flex-col gap-3">
            <Link href="/" className="flex items-center gap-2">
              <Film className="h-5 w-5 text-accent" />
              <span className="font-semibold text-foreground">MovieRate</span>
            </Link>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Кино мэдээлэл, үнэлгээ, трейлэр үзэх платформ.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-medium text-foreground">Хуудсууд</h4>
            <nav className="flex flex-col gap-2">
              <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Нүүр
              </Link>
              <Link href="/movies" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Төрлөөр хайх
              </Link>
            </nav>
          </div>

          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-medium text-foreground">Ангилал</h4>
            <nav className="flex flex-col gap-2">
              <Link href="/movies?genre=Action" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Action
              </Link>
              <Link href="/movies?genre=Drama" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Drama
              </Link>
              <Link href="/movies?genre=Comedy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Comedy
              </Link>
              <Link href="/movies?genre=Horror" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Horror
              </Link>
            </nav>
          </div>

          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-medium text-foreground">Холбоо барих</h4>
            <nav className="flex flex-col gap-2">
              <span className="text-sm text-muted-foreground">info@movierate.mn</span>
              <span className="text-sm text-muted-foreground">+976 9999 8888</span>
            </nav>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6 text-center">
          <p className="text-xs text-muted-foreground">
            &copy; 2024 MovieRate.mn. Бүх эрх хуулиар хамгаалагдсан.
          </p>
        </div>
      </div>
    </footer>
  )
}
