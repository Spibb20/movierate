"use client"

import { Star } from "lucide-react"
import { useState } from "react"

interface StarRatingProps {
  value: number
  onChange?: (value: number) => void
  readonly?: boolean
  size?: "sm" | "md"
}

export function StarRating({
  value,
  onChange,
  readonly = false,
  size = "md",
}: StarRatingProps) {
  const [hover, setHover] = useState(0)
  const iconSize = size === "sm" ? "h-4 w-4" : "h-5 w-5"

  return (
    <div className="flex items-center gap-0.5" role="group" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(star)}
          onMouseEnter={() => !readonly && setHover(star)}
          onMouseLeave={() => !readonly && setHover(0)}
          className={`${readonly ? "cursor-default" : "cursor-pointer"} transition-colors`}
          aria-label={`${star} star${star > 1 ? "s" : ""}`}
        >
          <Star
            className={`${iconSize} ${
              star <= (hover || value)
                ? "fill-accent text-accent"
                : "fill-none text-border"
            }`}
          />
        </button>
      ))}
    </div>
  )
}
