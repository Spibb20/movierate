import { Movie } from "./movie.js";

function fetchMovies() {
  return fetch("http://localhost:3000/movies")
    .then(function (response) {
      if (!response.ok) {
        throw new Error("Movie data could not be loaded.");
      }
      return response.json();
    })
    .then(function (data) {
      return data.map(function (item) {
        return new Movie(
          item.id,
          item.title,
          item.subtitle,
          item.genres,
          item.year,
          item.rating,
          item.poster,
          item.href,
          item.likes
        );
      });
    });
}

export { fetchMovies };
