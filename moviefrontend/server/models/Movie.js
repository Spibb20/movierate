const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    user: { type: String, required: true },
    avatar: { type: String, default: "ЗО" },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, required: true, trim: true },
    date: { type: String, required: true },
  },
  { _id: false }
);

const movieSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true, trim: true },
    titleMn: { type: String, required: true, trim: true },
    year: { type: Number, required: true, index: true },
    genre: [{ type: String, index: true }],
    rating: { type: Number, default: 0 },
    imdb: { type: Number, default: 0 },
    duration: { type: String, required: true },
    director: { type: String, required: true, trim: true },
    cast: [{ type: String }],
    synopsis: { type: String, required: true },
    poster: { type: String, required: true },
    trailer: { type: String, default: "" },
    reviews: [reviewSchema],
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Movie || mongoose.model("Movie", movieSchema);
