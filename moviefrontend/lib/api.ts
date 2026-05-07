import localMovies from "@/data/movies.json";
import localGenres from "@/data/genres.json";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export type Review = {
  id: string;
  user: string;
  avatar: string;
  rating: number;
  comment: string;
  date: string;
};

export type Movie = {
  id: string;
  title: string;
  titleMn: string;
  year: number;
  genre: string[];
  rating: number;
  imdb: number;
  duration: string;
  director: string;
  cast: string[];
  synopsis: string;
  poster: string;
  trailer: string;
  reviews: Review[];
};

export type User = {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  favorites: string[];
};

export type Rental = {
  movieId: string;
  rentedAt: number;
  expiresAt: number;
};

export type PaginatedMovies = {
  items: Movie[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

async function safeFetch<T>(url: string, fallback: T, init?: RequestInit): Promise<T> {
  try {
    const res = await fetch(url, { cache: "no-store", ...init });
    if (!res.ok) return fallback;
    return await res.json();
  } catch {
    return fallback;
  }
}

async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
    ...init,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Хүсэлт амжилтгүй боллоо");
  return data as T;
}

function moviesFallback(limit?: number): PaginatedMovies {
  const items = limit ? (localMovies as Movie[]).slice(0, limit) : (localMovies as Movie[]);
  return { items, total: items.length, page: 1, limit: limit || items.length, totalPages: 1 };
}

export async function getMovies(params?: {
  genre?: string;
  year?: string;
  q?: string;
  page?: string | number;
  limit?: string | number;
  sort?: string;
}): Promise<PaginatedMovies> {
  const query = new URLSearchParams();
  Object.entries(params || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== "") query.set(key, String(value));
  });
  return safeFetch<PaginatedMovies>(`${API_BASE_URL}/api/movies?${query.toString()}`, moviesFallback(Number(params?.limit) || undefined));
}

export async function getMovieList(params?: Parameters<typeof getMovies>[0]): Promise<Movie[]> {
  const result = await getMovies(params);
  return result.items;
}

export async function getMovieById(id: string): Promise<Movie | undefined> {
  const fallback = (localMovies as Movie[]).find((m) => m.id === id);
  return safeFetch<Movie | undefined>(`${API_BASE_URL}/api/movies/${id}`, fallback);
}

export async function getGenres(): Promise<readonly string[]> {
  return safeFetch<readonly string[]>(`${API_BASE_URL}/api/genres`, localGenres as readonly string[]);
}

export async function getTopRated(limit = 4): Promise<Movie[]> {
  const fallback = [...(localMovies as Movie[])].sort((a, b) => b.rating - a.rating).slice(0, limit);
  const result = await safeFetch<PaginatedMovies>(`${API_BASE_URL}/api/movies?sort=rating&limit=${limit}`, {
    items: fallback,
    total: fallback.length,
    page: 1,
    limit,
    totalPages: 1,
  });
  return result.items;
}

export const authApi = {
  signup: (body: { name: string; email: string; password: string }) =>
    apiRequest<User>("/api/auth/signup", { method: "POST", body: JSON.stringify(body) }),
  login: (body: { email: string; password: string }) =>
    apiRequest<User>("/api/auth/login", { method: "POST", body: JSON.stringify(body) }),
  logout: () => apiRequest<{ ok: true }>("/api/auth/logout", { method: "POST" }),
  me: () => apiRequest<User>("/api/auth/me"),
};

export const rentalApi = {
  list: () => apiRequest<Rental[]>("/api/rentals"),
  create: (movieId: string) => apiRequest<Rental>("/api/rentals", { method: "POST", body: JSON.stringify({ movieId }) }),
  remove: (movieId: string) => apiRequest<{ ok: true }>(`/api/rentals/${movieId}`, { method: "DELETE" }),
};

export const reviewApi = {
  create: (movieId: string, body: { rating: number; comment: string }) =>
    apiRequest<Review>(`/api/movies/${movieId}/reviews`, { method: "POST", body: JSON.stringify(body) }),
};

export const movieApi = {
  create: (body: Partial<Movie>) => apiRequest<Movie>("/api/movies", { method: "POST", body: JSON.stringify(body) }),
  update: (id: string, body: Partial<Movie>) => apiRequest<Movie>(`/api/movies/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  remove: (id: string) => apiRequest<{ ok: true }>(`/api/movies/${id}`, { method: "DELETE" }),
};
