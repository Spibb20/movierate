const mongoose = require("mongoose");

const rentalSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    movieId: { type: String, required: true, index: true },
    rentedAt: { type: Number, required: true },
    expiresAt: { type: Number, required: true, index: true },
  },
  { timestamps: true }
);

rentalSchema.index({ user: 1, movieId: 1 }, { unique: true });

module.exports = mongoose.models.Rental || mongoose.model("Rental", rentalSchema);
