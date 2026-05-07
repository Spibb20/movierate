import Link from "next/link";
import { useState } from "react";

export default function MovieCard({ movie }) {
  const [liked, setLiked] = useState(false);

  return (
    <article className="card fade-in">
      <div className="poster-wrap">
        <Link href={`/movie/${movie.id}`} className="poster-link">
          <img src={movie.poster} alt={movie.title} className="poster-tall" />
          <span className="rating-chip">{movie.rating.toFixed(1)} / 5</span>
          <span className="play-badge">Үзэх</span>
        </Link>
      </div>
      <div className="card-copy">
        <h3>
          <Link href={`/movie/${movie.id}`}>{movie.title}</Link>
        </h3>
        <p className="small">{movie.subtitle}</p>
        <div className="badge-row top-gap">
          {movie.genres.map((g) => (
            <span key={g} className="tag">
              {g}
            </span>
          ))}
          <span className="small">{movie.year}</span>
        </div>
        <button
          className={`save-button ${liked ? "active" : ""}`}
          onClick={() => setLiked(!liked)}
        >
          {liked ? "♥ Saved" : "♡ Save"}
        </button>
      </div>
    </article>
  );
}
