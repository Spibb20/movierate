require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const connectDb = require("./db");
const Movie = require("./models/Movie");
const User = require("./models/User");
const Rental = require("./models/Rental");
const Session = require("./models/Session");
const { requireAuth, requireRole } = require("./middleware/auth");
const {
  validatePassword,
  hashPassword,
  verifyPassword,
  createRawSessionToken,
  hashSessionToken,
} = require("./utils/auth");

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";
const SESSION_DAYS = Number(process.env.SESSION_DAYS || 7);
const isProduction = process.env.NODE_ENV === "production";

app.use(cors({ origin: CLIENT_URL, credentials: true }));
app.use(express.json({ limit: "2mb" }));
app.use(cookieParser());

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Het olon oroldlogo hiilee, try again later." },
});

function publicUser(user) {
  return {
    id: String(user._id),
    name: user.name,
    email: user.email,
    role: user.role,
    favorites: user.favorites || [],
    avatar: user.avatar || "",
  };
}

function setSessionCookie(res, rawToken, expiresAt) {
  res.cookie("session", rawToken, {
    httpOnly: true,
    sameSite: isProduction ? "none" : "lax",
    secure: isProduction,
    expires: expiresAt,
    path: "/",
  });
}

function clearSessionCookie(res) {
  res.clearCookie("session", {
    httpOnly: true,
    sameSite: isProduction ? "none" : "lax",
    secure: isProduction,
    path: "/",
  });
}

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, message: "MovieRate Express API running with MongoDB" });
});

app.post("/api/auth/signup", async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "name, email, password шаардлагатай" });
    }

    const passwordErrors = validatePassword(String(password));
    if (passwordErrors.length > 0) {
      return res.status(400).json({
        message: `Нууц үгэнд ${passwordErrors.join(", ")} шаардлагатай`,
      });
    }

    const exists = await User.findOne({ email: String(email).toLowerCase() });
    if (exists)
      return res.status(409).json({ message: "Энэ и-мэйл бүртгэлтэй байна" });

    const passwordRecord = await hashPassword(String(password));
    const user = await User.create({
      name: String(name).trim(),
      email: String(email).toLowerCase().trim(),
      passwordHash: passwordRecord.hash,
      passwordSalt: passwordRecord.salt,
      role: "user",
      favorites: [],
      avatar: "",
    });

    res.status(201).json(publicUser(user));
  } catch (error) {
    next(error);
  }
});

app.post("/api/auth/login", loginLimiter, async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res
        .status(400)
        .json({ message: "email болон password шаардлагатай" });

    const user = await User.findOne({ email: String(email).toLowerCase() });
    const locked = user?.lockUntil && user.lockUntil.getTime() > Date.now();
    if (locked)
      return res.status(423).json({
        message: "Нэвтрэх эрх түр түгжигдсэн. Дараа дахин оролдоно уу.",
      });

    const valid = user
      ? await verifyPassword(
          String(password),
          user.passwordSalt,
          user.passwordHash
        )
      : false;
    if (!valid) {
      if (user) {
        user.failedLoginAttempts += 1;
        if (user.failedLoginAttempts >= 5) {
          user.lockUntil = new Date(Date.now() + 10 * 60 * 1000);
          user.failedLoginAttempts = 0;
        }
        await user.save();
      }
      return res.status(401).json({ message: "И-мэйл эсвэл нууц үг буруу" });
    }

    user.failedLoginAttempts = 0;
    user.lockUntil = null;
    await user.save();

    const rawToken = createRawSessionToken();
    const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
    await Session.create({
      user: user._id,
      tokenHash: hashSessionToken(rawToken),
      expiresAt,
    });
    setSessionCookie(res, rawToken, expiresAt);

    res.json(publicUser(user));
  } catch (error) {
    next(error);
  }
});

app.post("/api/auth/logout", requireAuth, async (req, res, next) => {
  try {
    await Session.deleteOne({ _id: req.session._id });
    clearSessionCookie(res);
    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
});

app.get("/api/auth/me", requireAuth, (req, res) => {
  res.json(publicUser(req.user));
});

app.put("/api/users/me", requireAuth, async (req, res, next) => {
  try {
    const { name, avatar } = req.body;

    if (typeof name === "string") {
      const cleanName = name.trim();
      if (cleanName.length < 2) {
        return res
          .status(400)
          .json({ message: "Нэр хамгийн багадаа 2 тэмдэгт байна" });
      }
      req.user.name = cleanName;
    }

    if (typeof avatar === "string") {
      const validAvatar =
        avatar === "" ||
        /^data:image\/(png|jpeg|jpg|webp|gif);base64,[A-Za-z0-9+/=]+$/.test(
          avatar
        );

      if (!validAvatar) {
        return res.status(400).json({ message: "Зургийн формат буруу байна" });
      }

      if (avatar.length > 750000) {
        return res.status(413).json({ message: "Зураг хэт том байна" });
      }

      req.user.avatar = avatar;
    }

    await req.user.save();
    res.json(publicUser(req.user));
  } catch (error) {
    next(error);
  }
});

app.get("/api/movies", async (req, res, next) => {
  try {
    const {
      genre,
      year,
      q,
      sort = "createdAt",
      page = 1,
      limit = 12,
    } = req.query;
    const filter = {};
    if (genre) filter.genre = String(genre);
    if (year) filter.year = Number(year);
    if (q) {
      const regex = new RegExp(
        String(q).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
        "i"
      );
      filter.$or = [{ title: regex }, { titleMn: regex }, { director: regex }];
    }

    const pageNumber = Math.max(Number(page) || 1, 1);
    const limitNumber = Math.min(Math.max(Number(limit) || 12, 1), 50);
    const skip = (pageNumber - 1) * limitNumber;
    const sortMap = {
      rating: { rating: -1 },
      year: { year: -1 },
      title: { title: 1 },
      createdAt: { createdAt: -1 },
    };

    const [items, total] = await Promise.all([
      Movie.find(filter)
        .sort(sortMap[sort] || sortMap.createdAt)
        .skip(skip)
        .limit(limitNumber)
        .lean(),
      Movie.countDocuments(filter),
    ]);

    res.json({
      items,
      total,
      page: pageNumber,
      limit: limitNumber,
      totalPages: Math.ceil(total / limitNumber),
    });
  } catch (error) {
    next(error);
  }
});

app.post("/api/movies", requireAuth, async (req, res, next) => {
  try {
    const movie = await Movie.create({ ...req.body, owner: req.user._id });
    res.status(201).json(movie);
  } catch (error) {
    next(error);
  }
});

app.get("/api/movies/:id", async (req, res, next) => {
  try {
    const movie = await Movie.findOne({ id: req.params.id }).lean();
    if (!movie) return res.status(404).json({ message: "Кино олдсонгүй" });
    res.json(movie);
  } catch (error) {
    next(error);
  }
});

app.put("/api/movies/:id", requireAuth, async (req, res, next) => {
  try {
    const movie = await Movie.findOne({ id: req.params.id });
    if (!movie) return res.status(404).json({ message: "Кино олдсонгүй" });
    if (
      req.user.role !== "admin" &&
      String(movie.owner) !== String(req.user._id)
    ) {
      return res
        .status(403)
        .json({ message: "Өөр хэрэглэгчийн киног засах эрхгүй" });
    }
    Object.assign(movie, req.body, { id: movie.id, owner: movie.owner });
    await movie.save();
    res.json(movie);
  } catch (error) {
    next(error);
  }
});

app.delete("/api/movies/:id", requireAuth, async (req, res, next) => {
  try {
    const movie = await Movie.findOne({ id: req.params.id });
    if (!movie) return res.status(404).json({ message: "Кино олдсонгүй" });
    if (
      req.user.role !== "admin" &&
      String(movie.owner) !== String(req.user._id)
    ) {
      return res
        .status(403)
        .json({ message: "Өөр хэрэглэгчийн киног устгах эрхгүй" });
    }
    await movie.deleteOne();
    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
});

app.post("/api/movies/:id/reviews", requireAuth, async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    if (!rating || !comment)
      return res
        .status(400)
        .json({ message: "rating болон comment шаардлагатай" });
    const movie = await Movie.findOne({ id: req.params.id });
    if (!movie) return res.status(404).json({ message: "Кино олдсонгүй" });
    const review = {
      id: `r-${Date.now()}`,
      user: req.user.name,
      avatar: req.user.name.slice(0, 2).toUpperCase(),
      rating: Number(rating),
      comment: String(comment).trim(),
      date: new Date().toISOString().split("T")[0],
    };
    movie.reviews.unshift(review);
    await movie.save();
    res.status(201).json(review);
  } catch (error) {
    next(error);
  }
});

app.get("/api/genres", async (_req, res, next) => {
  try {
    const genres = await Movie.distinct("genre");
    res.json(genres);
  } catch (error) {
    next(error);
  }
});

app.get("/api/rental-config", (_req, res) => {
  res.json({
    durationDays: 3,
    priceLabel: "₮4,900",
    bank: {
      name: "Хаан банк",
      account: "5000000000",
      receiver: "MovieRate LLC",
    },
  });
});

app.get("/api/rentals", requireAuth, async (req, res, next) => {
  try {
    const rentals = await Rental.find({
      user: req.user._id,
      expiresAt: { $gt: Date.now() },
    }).lean();
    res.json(
      rentals.map((r) => ({
        movieId: r.movieId,
        rentedAt: r.rentedAt,
        expiresAt: r.expiresAt,
      }))
    );
  } catch (error) {
    next(error);
  }
});

app.post("/api/rentals", requireAuth, async (req, res, next) => {
  try {
    const { movieId } = req.body;
    if (!movieId)
      return res.status(400).json({ message: "movieId шаардлагатай" });
    const movie = await Movie.findOne({ id: movieId });
    if (!movie) return res.status(404).json({ message: "Кино олдсонгүй" });

    const now = Date.now();
    const durationMs = 3 * 24 * 60 * 60 * 1000;
    const rental = await Rental.findOneAndUpdate(
      { user: req.user._id, movieId },
      {
        user: req.user._id,
        movieId,
        rentedAt: now,
        expiresAt: now + durationMs,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    res.status(201).json({
      movieId: rental.movieId,
      rentedAt: rental.rentedAt,
      expiresAt: rental.expiresAt,
    });
  } catch (error) {
    next(error);
  }
});

app.delete("/api/rentals/:movieId", requireAuth, async (req, res, next) => {
  try {
    await Rental.deleteOne({ user: req.user._id, movieId: req.params.movieId });
    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
});

app.get(
  "/api/admin/users",
  requireAuth,
  requireRole("admin"),
  async (_req, res, next) => {
    try {
      const users = await User.find()
        .select("name email role favorites createdAt")
        .lean();
      res.json(users);
    } catch (error) {
      next(error);
    }
  }
);

app.use((err, _req, res, _next) => {
  console.error(err);
  if (err.code === 11000)
    return res.status(409).json({ message: "Давхардсан өгөгдөл байна" });
  res.status(500).json({ message: "Серверийн алдаа" });
});

if (process.env.NODE_ENV !== "test") {
  connectDb()
    .then(() =>
      app.listen(PORT, () =>
        console.log(`Express API: http://localhost:${PORT}`)
      )
    )
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = app;
