import { fetchMovies } from "./api.js";

function getMovieIdFromURL() {
  var params = new URLSearchParams(window.location.search);
  return parseInt(params.get("id"), 10);
}

function renderMovieDetail(movie) {
  var container = document.getElementById("movie-detail");

  if (!container) {
    return;
  }

  if (!movie) {
    container.innerHTML = "<p>Movie not found.</p>";
    return;
  }

  container.innerHTML = movie.toDetailHTML();
}

async function initMovieDetailPage() {
  try {
    var movieId = getMovieIdFromURL();
    var movies = await fetchMovies();
    var selectedMovie = null;

    movies.forEach(function (movie) {
      if (movie.id === movieId) {
        selectedMovie = movie;
      }
    });

    renderMovieDetail(selectedMovie);
  } catch (error) {
    var container = document.getElementById("movie-detail");

    if (container) {
      container.innerHTML = "Ugugdul Fetching Error";
    }
  }
}

initMovieDetailPage();
