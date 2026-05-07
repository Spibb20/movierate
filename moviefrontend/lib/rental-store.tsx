"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import { rentalApi, type Rental } from "@/lib/api";

interface RentalContextType {
  rentals: Rental[];
  rentMovie: (movieId: string) => Promise<void>;
  isRented: (movieId: string) => boolean;
  getRemainingTime: (movieId: string) => string | null;
  refreshRentals: () => Promise<void>;
}

const RentalContext = createContext<RentalContextType | null>(null);

export function RentalProvider({ children }: { children: ReactNode }) {
  const [rentals, setRentals] = useState<Rental[]>([]);

  const refreshRentals = useCallback(async () => {
    try {
      const data = await rentalApi.list();
      setRentals(data);
    } catch {
      setRentals([]);
    }
  }, []);

  useEffect(() => {
    refreshRentals();
  }, [refreshRentals]);

  const rentMovie = useCallback(async (movieId: string) => {
    const rental = await rentalApi.create(movieId);
    setRentals((prev) => [...prev.filter((r) => r.movieId !== movieId), rental]);
  }, []);

  const isRented = useCallback(
    (movieId: string) => {
      const rental = rentals.find((r) => r.movieId === movieId);
      if (!rental) return false;
      return rental.expiresAt > Date.now();
    },
    [rentals]
  );

  const getRemainingTime = useCallback(
    (movieId: string) => {
      const rental = rentals.find((r) => r.movieId === movieId);
      if (!rental) return null;
      const remaining = rental.expiresAt - Date.now();
      if (remaining <= 0) return null;
      const days = Math.floor(remaining / (24 * 60 * 60 * 1000));
      const hours = Math.floor((remaining % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
      if (days > 0) return `${days} өдөр ${hours} цаг`;
      return `${hours} цаг`;
    },
    [rentals]
  );

  return (
    <RentalContext.Provider value={{ rentals, rentMovie, isRented, getRemainingTime, refreshRentals }}>
      {children}
    </RentalContext.Provider>
  );
}

export function useRentals() {
  const context = useContext(RentalContext);
  if (!context) throw new Error("useRentals must be used within RentalProvider");
  return context;
}
