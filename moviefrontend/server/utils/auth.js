const crypto = require("crypto");
const bcrypt = require("bcryptjs");

function getSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("AUTH_SECRET must be at least 32 characters long");
  }
  return secret;
}

function pepperPassword(password) {
  return `${password}${getSecret()}`;
}

function validatePassword(password) {
  const errors = [];
  if (password.length < 8) errors.push("дор хаяж 8 тэмдэгт");
  if (!/[a-z]/.test(password)) errors.push("жижиг үсэг");
  if (!/[A-Z]/.test(password)) errors.push("том үсэг");
  if (!/\d/.test(password)) errors.push("тоо");
  if (!/[^A-Za-z0-9]/.test(password)) errors.push("тусгай тэмдэгт");
  return errors;
}

async function hashPassword(password) {
  return bcrypt.hash(pepperPassword(password), 12);
}

async function verifyPassword(password, hash) {
  return bcrypt.compare(pepperPassword(password), hash);
}

function createRawSessionToken() {
  return crypto.randomBytes(48).toString("hex");
}

function hashSessionToken(token) {
  return crypto.createHmac("sha256", getSecret()).update(token).digest("hex");
}

module.exports = {
  validatePassword,
  hashPassword,
  verifyPassword,
  createRawSessionToken,
  hashSessionToken,
};
