export default function MovieDetail({ movie }) {
  if (!movie) return <p>Кино олдсонгүй</p>;
  return (
    <div className="movie-layout page section">
      <div className="movie-grid">
        <div>
          <img src={movie.poster} alt={movie.title} className="poster-tall" />
        </div>
        <div>
          <h1>{movie.title}</h1>
          <p className="lead">
            {movie.subtitle} • {movie.year}
          </p>
          <div className="badge-row top-gap">
            <span className="badge badge-accent">{movie.rating} / 5</span>
          </div>
          <div className="badge-row top-gap">
            {movie.genres.map((g) => (
              <span key={g} className="tag">
                {g}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
