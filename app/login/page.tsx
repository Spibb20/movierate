"use client"

import Link from "next/link"
import { useState } from "react"
import { Film, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // Demo: redirect to profile
    window.location.href = "/profile"
  }

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
            <Film className="h-6 w-6 text-accent" />
          </div>
          <h1 className="text-2xl font-semibold text-foreground">Нэвтрэх</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            MovieRate.mn-д тавтай морил
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="email" className="text-sm text-foreground">
              И-мэйл
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-card"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="password" className="text-sm text-foreground">
              Нууц үг
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-card"
            />
          </div>

          <Button
            type="submit"
            className="mt-2 w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Нэвтрэх
            <ArrowRight className="h-4 w-4" />
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Бүртгэл байхгүй юу?{" "}
          <Link href="/register" className="font-medium text-accent hover:underline">
            Бүртгүүлэх
          </Link>
        </p>
      </div>
    </div>
  )
}
