"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { Film, Menu, X, User, LogIn, Search, Grid3X3 } from "lucide-react";
import navLinksData from "@/data/nav-links.json";
import { Button } from "@/components/ui/button";
import { movies } from "@/lib/data";
import { authApi, type User as AuthUser } from "@/lib/api";

const navIconMap = { Grid3X3 } as const;

const navLinks = navLinksData.map((link) => ({
  ...link,
  icon: link.icon
    ? navIconMap[link.icon as keyof typeof navIconMap]
    : undefined,
}));

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<typeof movies>([]);
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let mounted = true;
    async function loadAuth() {
      try {
        const me = await authApi.me();
        if (mounted) setAuthUser(me);
      } catch {
        if (mounted) setAuthUser(null);
      }
    }
    loadAuth();
    window.addEventListener("auth-changed", loadAuth);
    return () => {
      mounted = false;
      window.removeEventListener("auth-changed", loadAuth);
    };
  }, []);

  async function handleLogout() {
    await authApi.logout().catch(() => null);
    setAuthUser(null);
    window.dispatchEvent(new Event("auth-changed"));
    router.push("/login");
  }

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
        setSearchQuery("");
        setSearchResults([]);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSearch(query: string) {
    setSearchQuery(query);
    if (query.trim().length < 1) {
      setSearchResults([]);
      return;
    }
    const q = query.toLowerCase();
    const results = movies.filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        m.titleMn.toLowerCase().includes(q) ||
        m.director.toLowerCase().includes(q)
    );
    setSearchResults(results.slice(0, 5));
  }

  function handleResultClick(movieId: string) {
    setSearchOpen(false);
    setSearchQuery("");
    setSearchResults([]);
    router.push(`/movies/${movieId}`);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-lg">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-6 px-4">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <div className="flex h-10 w-15 items-center justify-center rounded-sm bg-accent p-2 gap-1">
            <Film className="h-4 w-4 text-accent-foreground" />

            <span className="text-base font-semibold tracking-tight text-background">
              MovieRate
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? "bg-accent/10 text-accent"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {Icon && <Icon className="h-3.5 w-3.5" />}
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div ref={searchRef} className="relative hidden flex-1 md:block">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Кино хайх..."
              aria-label="Кино хайх"
              value={searchQuery}
              onFocus={() => setSearchOpen(true)}
              onChange={(e) => {
                setSearchOpen(true);
                handleSearch(e.target.value);
              }}
              className="h-9 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm text-foreground outline-none placeholder:text-muted-foreground transition-all focus:border-accent/40 focus:ring-1 focus:ring-accent/20"
            />
          </div>
          {searchOpen && searchResults.length > 0 && (
            <div className="absolute left-0 top-full z-50 mt-2 w-full max-w-sm overflow-hidden rounded-xl border border-border bg-card shadow-lg">
              {searchResults.map((movie) => (
                <button
                  key={movie.id}
                  onClick={() => handleResultClick(movie.id)}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-secondary/60"
                >
                  <div className="h-10 w-7 shrink-0 overflow-hidden rounded bg-muted">
                    <img
                      src={movie.poster}
                      alt={`${movie.title} poster`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">
                      {movie.title}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {movie.titleMn} &middot; {movie.year}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
          {searchOpen &&
            searchQuery.length > 0 &&
            searchResults.length === 0 && (
              <div className="absolute left-0 top-full z-50 mt-2 w-full max-w-sm rounded-xl border border-border bg-card p-4 shadow-lg">
                <p className="text-center text-sm text-muted-foreground">
                  Илэрц олдсонгүй
                </p>
              </div>
            )}
        </div>

        <div className="hidden items-center gap-2 md:flex" aria-live="polite">
          {authUser ? (
            <>
              <Link href="/profile">
                <Button
                  size="sm"
                  className="gap-1.5 bg-accent text-accent-foreground hover:bg-accent/90"
                >
                  {authUser.avatar ? (
                    <img
                      src={authUser.avatar}
                      alt={`${authUser.name} profile`}
                      className="h-5 w-5 rounded-full object-cover"
                    />
                  ) : (
                    <User className="h-3.5 w-3.5" />
                  )}
                  Профайл
                </Button>
              </Link>
              <Button
                type="button"
                onClick={handleLogout}
                variant="ghost"
                size="sm"
                className="gap-1.5 text-sm text-muted-foreground hover:text-foreground"
              >
                Гарах
              </Button>
            </>
          ) : (
            <Link href="/login">
              <Button
                variant="ghost"
                size="sm"
                className="gap-1.5 text-sm text-muted-foreground hover:text-foreground"
              >
                <LogIn className="h-3.5 w-3.5" />
                Нэвтрэх
              </Button>
            </Link>
          )}
        </div>

        <div className="flex flex-1 items-center justify-end gap-2 md:hidden">
          <button
            onClick={() => {
              setSearchOpen(!searchOpen);
              setMobileOpen(false);
            }}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary"
            aria-label="Хайх"
          >
            <Search className="h-4 w-4" />
          </button>
          <button
            onClick={() => {
              setMobileOpen(!mobileOpen);
              setSearchOpen(false);
            }}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary"
            aria-label="Цэс"
          >
            {mobileOpen ? (
              <X className="h-4 w-4" />
            ) : (
              <Menu className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {searchOpen && (
        <div className="border-t border-border bg-card px-4 py-3 md:hidden">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Кино хайх..."
              aria-label="Кино хайх"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              autoFocus
              className="h-9 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-accent/40"
            />
          </div>
          {searchResults.length > 0 && (
            <div className="mt-2 flex flex-col overflow-hidden rounded-lg border border-border bg-card">
              {searchResults.map((movie) => (
                <button
                  key={movie.id}
                  onClick={() => {
                    handleResultClick(movie.id);
                    setSearchOpen(false);
                  }}
                  className="flex items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-secondary/60"
                >
                  <div className="h-9 w-6 shrink-0 overflow-hidden rounded bg-muted">
                    <img
                      src={movie.poster}
                      alt={`${movie.title} poster`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">
                      {movie.title}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {movie.year}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
      {mobileOpen && (
        <div className="border-t border-border bg-card px-4 pb-4 pt-2 md:hidden">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? "bg-accent/10 text-accent"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div
              className="mt-2 flex flex-col gap-2 border-t border-border pt-3"
              aria-live="polite"
            >
              {authUser ? (
                <>
                  <Link href="/profile" onClick={() => setMobileOpen(false)}>
                    <Button
                      size="sm"
                      className="w-full justify-start gap-1.5 bg-accent text-accent-foreground hover:bg-accent/90"
                    >
                      <User className="h-3.5 w-3.5" />
                      Профайл
                    </Button>
                  </Link>
                  <Button
                    type="button"
                    onClick={() => {
                      setMobileOpen(false);
                      handleLogout();
                    }}
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start gap-1.5"
                  >
                    Гарах
                  </Button>
                </>
              ) : (
                <Link href="/login" onClick={() => setMobileOpen(false)}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start gap-1.5"
                  >
                    <LogIn className="h-3.5 w-3.5" />
                    Нэвтрэх
                  </Button>
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
