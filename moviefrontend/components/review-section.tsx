"use client"

import { useState } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { StarRating } from "@/components/star-rating"
import type { Review } from "@/lib/data"

export function ReviewSection({ reviews: initialReviews }: { reviews: Review[] }) {
  const [reviews, setReviews] = useState(initialReviews)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (rating === 0 || !comment.trim()) return

    const newReview: Review = {
      id: `r-${Date.now()}`,
      user: "Зочин",
      avatar: "ЗО",
      rating,
      comment: comment.trim(),
      date: new Date().toISOString().split("T")[0],
    }

    setReviews([newReview, ...reviews])
    setRating(0)
    setComment("")
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <section className="flex flex-col gap-8">
      <h2 className="text-lg font-semibold text-foreground">
        Сэтгэгдэл ({reviews.length})
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5">
        <p className="text-sm font-medium text-foreground">Үнэлгээ өгөх</p>
        <StarRating value={rating} onChange={setRating} />
        <Textarea
          placeholder="Сэтгэгдэл бичих..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="min-h-[80px] resize-none bg-background"
        />
        <div className="flex items-center gap-3">
          <Button
            type="submit"
            disabled={rating === 0 || !comment.trim()}
            className="bg-accent text-accent-foreground hover:bg-accent/90"
          >
            Илгээх
          </Button>
          {submitted && (
            <span className="text-sm text-accent">Сэтгэгдэл амжилттай нэмэгдлээ!</span>
          )}
        </div>
      </form>

      <div className="flex flex-col gap-4">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="flex gap-3 rounded-xl border border-border bg-card p-4"
          >
            <Avatar className="h-9 w-9 shrink-0 bg-secondary">
              <AvatarFallback className="bg-secondary text-xs font-medium text-secondary-foreground">
                {review.avatar}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-1 flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-foreground">
                  {review.user}
                </span>
                <span className="text-xs text-muted-foreground">{review.date}</span>
              </div>
              <StarRating value={review.rating} readonly size="sm" />
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {review.comment}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
