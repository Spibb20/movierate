require("dotenv").config();

const fs = require("fs/promises");
const path = require("path");
const connectDb = require("../db");
const Movie = require("../models/Movie");
const User = require("../models/User");
const { hashPassword } = require("../utils/auth");

async function readJson(fileName) {
  const raw = await fs.readFile(path.join(__dirname, "..", "..", "data", fileName), "utf-8");
  return JSON.parse(raw);
}

async function seed() {
  await connectDb();
  const movies = await readJson("movies.json");
  const users = await readJson("users.json");

  await Movie.deleteMany({});
  await Movie.insertMany(movies.map((movie) => ({ ...movie, owner: null })));

  await User.deleteMany({});
  await User.create({
    name: users[0]?.name || "Admin",
    email: users[0]?.email || "admin@movierate.mn",
    passwordHash: await hashPassword("Admin@123"),
    role: "admin",
    favorites: users[0]?.favorites || [],
  });

  console.log(`Seeded ${movies.length} movies and 1 admin user`);
  process.exit(0);
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
