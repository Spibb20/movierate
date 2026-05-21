"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  LogOut,
  Heart,
  Settings,
  Shield,
  PlayCircle,
  Clock,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MovieCard } from "@/components/movie-card";
import { useRentals } from "@/lib/rental-store";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { authApi, getMovieList, type Movie, type User } from "@/lib/api";

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState("");
  const [saved, setSaved] = useState(false);
  const [message, setMessage] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const { rentals, getRemainingTime } = useRentals();

  useEffect(() => {
    async function load() {
      try {
        const [me, movieList] = await Promise.all([
          authApi.me(),
          getMovieList({ limit: 50 }),
        ]);
        setUser(me);
        setName(me.name);
        setMovies(movieList);
      } catch {
        window.location.href = "/login";
      }
    }
    load();
  }, []);

  if (!user) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10 text-sm text-muted-foreground">
        Ачааллаж байна...
      </div>
    );
  }

  const favoriteMovies = movies.filter((m) => user.favorites.includes(m.id));
  const activeRentals = rentals.filter((r) => r.expiresAt > Date.now());
  const rentedMovies = movies.filter((m) =>
    activeRentals.some((r) => r.movieId === m.id)
  );

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    try {
      const updated = await authApi.updateMe({ name });
      setUser(updated);
      setName(updated.name);
      window.dispatchEvent(new Event("auth-changed"));
      setSaved(true);
      setMessage("Амжилттай хадгаллаа");
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setMessage(
        err instanceof Error ? err.message : "Хадгалах үед алдаа гарлаа"
      );
    }
  }

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setMessage("");

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    const maxSize = 300 * 1024;

    if (!allowedTypes.includes(file.type)) {
      setMessage("Зөвхөн JPG, PNG, WEBP эсвэл GIF зураг сонгоно уу");
      return;
    }

    if (file.size > maxSize) {
      setMessage("Зураг 700KB-аас бага хэмжээтэй байх ёстой");
      return;
    }

    const reader = new FileReader();

    reader.onload = async () => {
      try {
        const avatar = String(reader.result);
        setUser((prev) => (prev ? { ...prev, avatar } : prev));

        const updated = await authApi.updateMe({ avatar });
        setUser(updated);

        window.dispatchEvent(new Event("auth-changed"));
        setMessage("Профайл зураг амжилттай шинэчлэгдлээ");
      } catch (err) {
        setMessage(
          err instanceof Error ? err.message : "Зураг хадгалах үед алдаа гарлаа"
        );
      }
    };

    reader.onerror = () => {
      setMessage("Зураг унших үед алдаа гарлаа");
    };

    reader.readAsDataURL(file);
  }

  async function handleLogout() {
    await authApi.logout().catch(() => null);
    window.dispatchEvent(new Event("auth-changed"));
    window.location.href = "/login";
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="mb-8 flex items-center gap-4 rounded-2xl border border-border bg-card p-6">
        <Avatar className="h-16 w-16 bg-accent/10">
          {user.avatar && (
            <AvatarImage
              src={user.avatar}
              alt={`${user.name} profile picture`}
              className="object-cover"
            />
          )}
          <AvatarFallback className="bg-accent/10 text-lg font-semibold text-accent">
            {user.name.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-bold text-foreground">{user.name}</h1>
          <p className="text-sm text-muted-foreground">{user.email}</p>
          <p className="mt-1 text-xs text-accent">role: {user.role}</p>
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

        <TabsContent value="rentals">
          {rentedMovies.length === 0 ? (
            <div className="flex flex-col items-center rounded-2xl border border-dashed border-border py-16 text-center">
              <PlayCircle className="mb-3 h-8 w-8 text-muted-foreground" />
              <p className="text-sm font-medium text-foreground">
                Түрээсэлсэн кино байхгүй
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Кино түрээслэхийн тулд кино дэлгэрэнгүй хуудас руу орно уу.
              </p>
              <Link href="/movies" className="mt-4">
                <Button variant="outline" size="sm" className="gap-1.5">
                  Кино үзэх
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {rentedMovies.map((movie) => (
                <div key={movie.id} className="flex flex-col gap-2">
                  <MovieCard movie={movie} />
                  <div className="flex items-center gap-1.5 rounded-lg bg-accent/10 px-2.5 py-1.5">
                    <Clock className="h-3 w-3 text-accent" />
                    <span className="text-[11px] font-medium text-accent">
                      {getRemainingTime(movie.id)} үлдсэн
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

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

        <TabsContent value="settings">
          <div className="max-w-md rounded-2xl border border-border bg-card p-6">
            <form onSubmit={handleSave} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="profile-name"
                  className="text-sm text-foreground"
                >
                  Нэр
                </Label>
                <Input
                  id="profile-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-background"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="profile-email"
                  className="text-sm text-foreground"
                >
                  И-мэйл
                </Label>
                <Input
                  id="profile-email"
                  value={user.email}
                  disabled
                  className="bg-muted"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="profile-avatar"
                  className="text-sm text-foreground"
                >
                  Профайл зураг
                </Label>

                <Input
                  id="profile-avatar"
                  name="avatar"
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  onChange={handleAvatarChange}
                  aria-describedby="avatar-help profile-message"
                  className="bg-background"
                />

                <p id="avatar-help" className="text-xs text-muted-foreground">
                  JPG, PNG, WEBP эсвэл GIF зураг сонгоно. Дээд хэмжээ: 700KB.
                </p>
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
              {message && (
                <p
                  id="profile-message"
                  role="status"
                  aria-live="polite"
                  className="text-sm text-muted-foreground"
                >
                  {message}
                </p>
              )}
            </form>

            <div className="mt-6 flex flex-col gap-3 border-t border-border pt-5">
              {user.role === "admin" && (
                <Link href="/admin">
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2"
                  >
                    <Shield className="h-4 w-4" />
                    Админ хуудас
                  </Button>
                </Link>
              )}
              <Button
                onClick={handleLogout}
                variant="ghost"
                className="w-full justify-start gap-2 text-destructive hover:text-destructive"
              >
                <LogOut className="h-4 w-4" />
                Гарах
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
