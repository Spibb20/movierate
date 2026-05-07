import { fetchMovies } from "./api.js";
import { MovieCard } from "./components/movie-card.js";
import { StatsItem } from "./components/stats-item.js";
import { EmptyState } from "./components/empty-state.js";

var allMovies = [];
var likedMovieIds = [];
var movieCardInstances = {};

function getFiltersFromURL() {
  var params = new URLSearchParams(window.location.search);

  return {
    search: params.get("search") || "",
    genre: params.get("genre") || "",
    year: params.get("year") || "",
    rating: params.get("rating") || "",
  };
}

function setFilterValues(filters) {
  var searchInput = document.getElementById("movie-search");
  var genreFilter = document.getElementById("genre-filter");
  var yearFilter = document.getElementById("year-filter");
  var ratingFilter = document.getElementById("rating-filter");

  if (searchInput) {
    searchInput.value = filters.search;
  }

  if (genreFilter) {
    genreFilter.value = filters.genre;
  }

  if (yearFilter) {
    yearFilter.value = filters.year;
  }

  if (ratingFilter) {
    ratingFilter.value = filters.rating;
  }
}

function getFilteredMovies() {
  var filters = getFiltersFromURL();

  return allMovies.filter(function (movie) {
    return movie.matchesFilters(filters);
  });
}

function renderStats(movies) {
  var statsContainer = document.getElementById("stats-row");
  var total = 0;
  var recentCount = 0;
  var average = "0.0";
  var html = "";

  if (!statsContainer) {
    return;
  }

  total = movies.length;

  recentCount = movies.filter(function (movie) {
    return movie.year === 2024;
  }).length;

  if (movies.length > 0) {
    average = (
      movies.reduce(function (sum, movie) {
        return sum + movie.rating;
      }, 0) / movies.length
    ).toFixed(1);
  }

  html += StatsItem(total, "Нийт кино");
  html += StatsItem(recentCount, "2024 оны кино");
  html += StatsItem(average, "Дундаж үнэлгээ");

  statsContainer.innerHTML = html;
}

function getOrCreateMovieCard(movie) {
  var isLiked = likedMovieIds.indexOf(movie.id) !== -1;
  var cardInstance = movieCardInstances[movie.id];

  if (!cardInstance) {
    cardInstance = new MovieCard({
      movie: movie,
      isLiked: isLiked,
      onToggleLike: toggleLike,
    });

    movieCardInstances[movie.id] = cardInstance;
  } else {
    cardInstance.update({
      movie: movie,
      isLiked: isLiked,
      onToggleLike: toggleLike,
    });
  }

  return cardInstance;
}

function syncCardInstances() {
  var validIds = {};
  var i = 0;
  var id = "";

  for (i = 0; i < allMovies.length; i += 1) {
    validIds[allMovies[i].id] = true;
  }

  for (id in movieCardInstances) {
    if (movieCardInstances.hasOwnProperty(id) && !validIds[id]) {
      delete movieCardInstances[id];
    }
  }
}

function renderMovies() {
  var grid = document.getElementById("movies-grid");
  var filteredMovies = getFilteredMovies();
  var emptyElement = null;
  var cardInstance = null;
  var i = 0;

  if (!grid) {
    return;
  }

  grid.innerHTML = "";

  if (filteredMovies.length === 0) {
    emptyElement = document.createElement("div");
    emptyElement.innerHTML = EmptyState("Тохирох кино олдсонгүй.");
    grid.appendChild(emptyElement.firstChild);
    return;
  }

  for (i = 0; i < filteredMovies.length; i += 1) {
    cardInstance = getOrCreateMovieCard(filteredMovies[i]);
    grid.appendChild(cardInstance.getElement());
  }
}

function rerenderPage() {
  var filteredMovies = getFilteredMovies();
  renderStats(filteredMovies);
  renderMovies();
}

function toggleLike(movieId) {
  var index = likedMovieIds.indexOf(movieId);
  var movie = null;
  var i = 0;

  for (i = 0; i < allMovies.length; i += 1) {
    if (allMovies[i].id === movieId) {
      movie = allMovies[i];
      break;
    }
  }

  if (!movie) {
    return;
  }

  if (index === -1) {
    likedMovieIds.push(movieId);
    movie.likes += 1;
  } else {
    likedMovieIds.splice(index, 1);

    if (movie.likes > 0) {
      movie.likes -= 1;
    }
  }

  rerenderPage();
}

function initMoviesPage() {
  var filters = getFiltersFromURL();
  setFilterValues(filters);

  fetchMovies()
    .then(function (movies) {
      allMovies = movies;
      syncCardInstances();
      rerenderPage();
    })
    .catch(function () {
      var grid = document.getElementById("movies-grid");

      if (grid) {
        grid.innerHTML = EmptyState("Өгөгдөл ачааллахад алдаа гарлаа.");
      }
    });
}

initMoviesPage();
