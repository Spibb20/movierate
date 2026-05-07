function Movie(id, title, subtitle, genres, year, rating, poster, href, likes) {
  this.id = id;
  this.title = title;
  this.subtitle = subtitle;
  this.genres = genres;
  this.year = year;
  this.rating = rating;
  this.poster = poster;
  this.href = href;
  this.likes = likes || 0;
}

Movie.prototype.matchesFilters = function (filters) {
  var matchesSearch = true;
  var matchesGenre = true;
  var matchesYear = true;
  var matchesRating = true;

  if (filters.search !== "") {
    matchesSearch =
      this.title.toLowerCase().indexOf(filters.search.toLowerCase()) !== -1 ||
      this.subtitle.toLowerCase().indexOf(filters.search.toLowerCase()) !== -1;
  }

  if (filters.genre !== "") {
    matchesGenre = this.genres.indexOf(filters.genre) !== -1;
  }

  if (filters.year !== "") {
    matchesYear = String(this.year) === filters.year;
  }

  if (filters.rating !== "") {
    matchesRating = this.rating >= parseFloat(filters.rating);
  }

  return matchesSearch && matchesGenre && matchesYear && matchesRating;
};

export { Movie };
