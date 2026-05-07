import Header from "../components/Header";
import Footer from "../components/Footer";
import MovieCard from "../components/MovieCard";
import moviesData from "../data/movies.json";

export default function MoviesPage() {
  return (
    <>
      <Header />
      <div className="page section grid-4">
        {moviesData.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
      <Footer />
    </>
  );
}
