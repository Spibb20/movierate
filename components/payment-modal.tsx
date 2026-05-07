"use client"

import { useState } from "react"
import { X, CreditCard, Smartphone, Building2, CheckCircle2, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Movie } from "@/lib/data"

type PaymentMethod = "qpay" | "socialpay" | "bank" | null

interface PaymentModalProps {
  movie: Movie
  open: boolean
  onClose: () => void
  onSuccess: () => void
}

export function PaymentModal({ movie, open, onClose, onSuccess }: PaymentModalProps) {
  const [method, setMethod] = useState<PaymentMethod>(null)
  const [step, setStep] = useState<"select" | "details" | "processing" | "success">("select")
  const [phone, setPhone] = useState("")

  if (!open) return null

  function handlePay() {
    if (!method) return
    setStep("processing")
    setTimeout(() => {
      setStep("success")
    }, 2000)
  }

  function handleDone() {
    onSuccess()
    setMethod(null)
    setStep("select")
    setPhone("")
  }

  function handleClose() {
    onClose()
    setMethod(null)
    setStep("select")
    setPhone("")
  }

  const methods = [
    {
      id: "qpay" as const,
      name: "QPay",
      desc: "QR кодоор төлөх",
      icon: Smartphone,
    },
    {
      id: "socialpay" as const,
      name: "SocialPay",
      desc: "Утасны дугаараар төлөх",
      icon: CreditCard,
    },
    {
      id: "bank" as const,
      name: "Банкны шилжүүлэг",
      desc: "Дансны шилжүүлгээр",
      icon: Building2,
    },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative z-10 mx-4 w-full max-w-md overflow-hidden rounded-2xl border border-border bg-card shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div>
            <h3 className="font-semibold text-foreground">Кино түрээслэх</h3>
            <p className="text-xs text-muted-foreground">{movie.title} - 3 хоногийн эрх</p>
          </div>
          <button
            onClick={handleClose}
            className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            aria-label="Хаах"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="px-6 py-5">
          {step === "select" && (
            <div className="flex flex-col gap-3">
              <p className="mb-1 text-sm text-muted-foreground">Төлбөрийн хэрэгсэл сонгоно уу</p>
              {methods.map((m) => {
                const Icon = m.icon
                return (
                  <button
                    key={m.id}
                    onClick={() => {
                      setMethod(m.id)
                      setStep("details")
                    }}
                    className="flex items-center gap-4 rounded-xl border border-border bg-background p-4 text-left transition-all hover:border-accent/40 hover:shadow-sm"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10">
                      <Icon className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{m.name}</p>
                      <p className="text-xs text-muted-foreground">{m.desc}</p>
                    </div>
                  </button>
                )
              })}
              <div className="mt-2 flex items-center justify-between rounded-lg bg-secondary/60 px-4 py-3">
                <span className="text-sm text-muted-foreground">Нийт дүн</span>
                <span className="text-lg font-semibold text-foreground">4,900&#8366;</span>
              </div>
            </div>
          )}

          {step === "details" && (
            <div className="flex flex-col gap-4">
              <button
                onClick={() => {
                  setStep("select")
                  setMethod(null)
                }}
                className="self-start text-xs text-accent hover:underline"
              >
                Буцах
              </button>

              {method === "qpay" && (
                <div className="flex flex-col items-center gap-4">
                  <div className="flex h-48 w-48 items-center justify-center rounded-xl border-2 border-dashed border-border bg-secondary/40">
                    <div className="text-center">
                      <Smartphone className="mx-auto mb-2 h-8 w-8 text-accent" />
                      <p className="text-xs text-muted-foreground">QR код</p>
                      <p className="mt-1 text-[10px] text-muted-foreground">QPay апп-аар уншуулна уу</p>
                    </div>
                  </div>
                  <Button onClick={handlePay} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                    Төлсөн
                  </Button>
                </div>
              )}

              {method === "socialpay" && (
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-2">
                    <Label className="text-sm text-foreground">Утасны дугаар</Label>
                    <Input
                      placeholder="9911 2233"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="bg-background"
                    />
                  </div>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    SocialPay апп руу нэхэмжлэл илгээгдэнэ. Апп дотроосоо баталгаажуулна уу.
                  </p>
                  <Button
                    onClick={handlePay}
                    disabled={phone.length < 8}
                    className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                  >
                    Нэхэмжлэл илгээх
                  </Button>
                </div>
              )}

              {method === "bank" && (
                <div className="flex flex-col gap-3">
                  <div className="rounded-xl border border-border bg-secondary/40 p-4">
                    <p className="mb-2 text-xs font-medium text-foreground">Шилжүүлгийн мэдээлэл</p>
                    <div className="flex flex-col gap-1.5 text-sm text-muted-foreground">
                      <div className="flex justify-between">
                        <span>Банк:</span>
                        <span className="font-medium text-foreground">Хаан банк</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Данс:</span>
                        <span className="font-mono font-medium text-foreground">5089 1234 5678</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Хүлээн авагч:</span>
                        <span className="font-medium text-foreground">MovieRate ХХК</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Дүн:</span>
                        <span className="font-medium text-foreground">4,900&#8366;</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Гүйлгээний утга:</span>
                        <span className="font-mono font-medium text-foreground">MR-{movie.id}</span>
                      </div>
                    </div>
                  </div>
                  <Button onClick={handlePay} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                    Шилжүүлсэн
                  </Button>
                </div>
              )}
            </div>
          )}

          {step === "processing" && (
            <div className="flex flex-col items-center gap-4 py-8">
              <div className="h-10 w-10 animate-spin rounded-full border-2 border-accent border-t-transparent" />
              <p className="text-sm text-muted-foreground">Төлбөр шалгаж байна...</p>
            </div>
          )}

          {step === "success" && (
            <div className="flex flex-col items-center gap-4 py-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent/10">
                <CheckCircle2 className="h-7 w-7 text-accent" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-foreground">Амжилттай!</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Кино 3 хоногийн турш үзэх эрхтэй боллоо.
                </p>
              </div>
              <div className="flex items-center gap-1.5 rounded-lg bg-secondary/60 px-3 py-2">
                <Clock className="h-3.5 w-3.5 text-accent" />
                <span className="text-xs text-muted-foreground">3 өдөр үлдсэн</span>
              </div>
              <Button onClick={handleDone} className="mt-1 w-full bg-accent text-accent-foreground hover:bg-accent/90">
                Үзэх
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
