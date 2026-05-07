import Header from "../components/Header";
import Footer from "../components/Footer";
import MovieCard from "../components/MovieCard";
import moviesData from "../data/movies.json";

export default function ProfilePage() {
  const savedMovies = [moviesData[0], moviesData[3]]; // example saved movies

  return (
    <>
      <Header />
      <div className="page section profile-box card-pad">
        <div className="title-row">
          <div>
            <h1>Bat-Erdene</h1>
            <p className="small">baterdene@example.com</p>
          </div>
          <div className="badge-row">
            <span className="badge badge-accent">User</span>
            <a href="/" className="mini-button">
              Гарах
            </a>
          </div>
        </div>
      </div>

      <div className="page section">
        <h2>Хадгалсан кино</h2>
        <div className="grid-4">
          {savedMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
}
