"use client";

import Link from "next/link";
import { useState } from "react";
import { Film, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authApi } from "@/lib/api";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password !== confirm) return;
    setLoading(true);
    try {
      await authApi.signup({ name, email, password });
      window.location.href = "/login";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Бүртгүүлэх үед алдаа гарлаа");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
            <Film className="h-6 w-6 text-accent" />
          </div>
          <h1 className="text-2xl font-semibold text-foreground">Бүртгүүлэх</h1>
          <p className="mt-1 text-sm text-muted-foreground">Шинэ хаяг үүсгэх</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name" className="text-sm text-foreground">Нэр</Label>
            <Input id="name" type="text" placeholder="Таны нэр" value={name} onChange={(e) => setName(e.target.value)} required className="bg-card" />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="email" className="text-sm text-foreground">И-мэйл</Label>
            <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="bg-card" />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="password" className="text-sm text-foreground">Нууц үг</Label>
            <Input id="password" type="password" placeholder="********" value={password} onChange={(e) => setPassword(e.target.value)} required className="bg-card" />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="confirm" className="text-sm text-foreground">Нууц үг давтах</Label>
            <Input id="confirm" type="password" placeholder="********" value={confirm} onChange={(e) => setConfirm(e.target.value)} required className="bg-card" />
            {password && confirm && password !== confirm && <p className="text-xs text-destructive">Нууц үг таарахгүй байна</p>}
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" disabled={loading || password !== confirm} className="mt-2 w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
            {loading ? "Бүртгэж байна..." : "Бүртгүүлэх"}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Бүртгэлтэй юу? <Link href="/login" className="font-medium text-accent hover:underline">Нэвтрэх</Link>
        </p>
      </div>
    </div>
  );
}
