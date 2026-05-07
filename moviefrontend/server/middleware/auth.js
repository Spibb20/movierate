const Session = require("../models/Session");
const { hashSessionToken } = require("../utils/auth");

async function requireAuth(req, res, next) {
  try {
    const token = req.cookies?.session;
    if (!token) return res.status(401).json({ message: "Нэвтрэх шаардлагатай" });

    const session = await Session.findOne({ tokenHash: hashSessionToken(token) }).populate("user");
    if (!session || session.expiresAt.getTime() <= Date.now()) {
      return res.status(401).json({ message: "Session дууссан эсвэл хүчингүй байна" });
    }

    req.session = session;
    req.user = session.user;
    next();
  } catch (error) {
    next(error);
  }
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: "Нэвтрэх шаардлагатай" });
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Энэ үйлдлийг хийх эрхгүй" });
    }
    next();
  };
}

module.exports = { requireAuth, requireRole };
