function MovieCard(options) {
  this.movie = options.movie;
  this.isLiked = Boolean(options.isLiked);
  this.onToggleLike = options.onToggleLike || function () {};
  this.element = null;

  this.render();
}

MovieCard.prototype.getSaveButtonText = function () {
  if (this.isLiked) {
    return "♥ Saved (" + this.movie.likes + ")";
  }

  return "♡ Save (" + this.movie.likes + ")";
};

MovieCard.prototype.getSaveButtonClassName = function () {
  if (this.isLiked) {
    return "save-button active";
  }

  return "save-button";
};

MovieCard.prototype.createGenreRow = function () {
  var badgeRow = document.createElement("div");
  var yearText = document.createElement("span");
  var genreTag = null;
  var i = 0;

  badgeRow.className = "badge-row top-gap";

  for (i = 0; i < this.movie.genres.length; i += 1) {
    genreTag = document.createElement("span");
    genreTag.className = "tag";
    genreTag.textContent = this.movie.genres[i];
    badgeRow.appendChild(genreTag);
  }

  yearText.className = "small";
  yearText.textContent = String(this.movie.year);
  badgeRow.appendChild(yearText);

  return badgeRow;
};

MovieCard.prototype.handleToggleLike = function () {
  this.onToggleLike(this.movie.id);
};

MovieCard.prototype.render = function () {
  var self = this;

  var card = document.createElement("article");
  var posterWrap = document.createElement("div");
  var posterLink = document.createElement("a");
  var posterImage = document.createElement("img");
  var ratingChip = document.createElement("span");
  var playBadge = document.createElement("span");

  var cardCopy = document.createElement("div");
  var titleHeading = document.createElement("h3");
  var titleLink = document.createElement("a");
  var subtitle = document.createElement("p");

  var actionWrap = document.createElement("div");
  var saveButton = document.createElement("button");

  card.className = "card fade-in";

  posterWrap.className = "poster-wrap";

  posterLink.href = this.movie.href;
  posterLink.className = "poster-link";

  posterImage.src = this.movie.poster;
  posterImage.alt = this.movie.title + " постер";
  posterImage.className = "poster-tall";

  ratingChip.className = "rating-chip";
  ratingChip.textContent = this.movie.rating.toFixed(1) + " / 5";

  playBadge.className = "play-badge";
  playBadge.textContent = "Үзэх";

  posterLink.appendChild(posterImage);
  posterLink.appendChild(ratingChip);
  posterLink.appendChild(playBadge);
  posterWrap.appendChild(posterLink);

  cardCopy.className = "card-copy";

  titleLink.href = this.movie.href;
  titleLink.className = "card-title-link";
  titleLink.textContent = this.movie.title;

  titleHeading.appendChild(titleLink);

  subtitle.className = "small";
  subtitle.textContent = this.movie.subtitle;

  actionWrap.className = "top-gap";

  saveButton.type = "button";
  saveButton.className = this.getSaveButtonClassName();
  saveButton.textContent = this.getSaveButtonText();

  saveButton.addEventListener("click", function () {
    self.handleToggleLike();
  });

  actionWrap.appendChild(saveButton);

  cardCopy.appendChild(titleHeading);
  cardCopy.appendChild(subtitle);
  cardCopy.appendChild(this.createGenreRow());
  cardCopy.appendChild(actionWrap);

  card.appendChild(posterWrap);
  card.appendChild(cardCopy);

  this.element = card;

  return this.element;
};

MovieCard.prototype.update = function (nextOptions) {
  var parent = this.element ? this.element.parentNode : null;
  var oldElement = this.element;

  if (nextOptions.movie) {
    this.movie = nextOptions.movie;
  }

  if (typeof nextOptions.isLiked === "boolean") {
    this.isLiked = nextOptions.isLiked;
  }

  if (typeof nextOptions.onToggleLike === "function") {
    this.onToggleLike = nextOptions.onToggleLike;
  }

  this.render();

  if (parent && oldElement) {
    parent.replaceChild(this.element, oldElement);
  }
};

MovieCard.prototype.getElement = function () {
  return this.element;
};

export { MovieCard };
