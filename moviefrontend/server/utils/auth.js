const crypto = require("crypto");

function getSecret() {
  const secret =
    process.env.AUTH_SECRET || "dev-only-change-this-secret-32chars-minimum";
  if (!secret || secret.length < 32) {
    throw new Error("AUTH_SECRET must be at least 32 characters long");
  }
  return secret;
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

function createPasswordSalt() {
  return crypto.randomBytes(16).toString("hex");
}

function hashPasswordWithSalt(password, salt) {
  return crypto
    .pbkdf2Sync(`${password}${getSecret()}`, salt, 120000, 64, "sha512")
    .toString("hex");
}

async function hashPassword(password, salt = createPasswordSalt()) {
  return { salt, hash: hashPasswordWithSalt(password, salt) };
}

async function verifyPassword(password, salt, expectedHash) {
  const actualHash = hashPasswordWithSalt(password, salt);
  return crypto.timingSafeEqual(
    Buffer.from(actualHash, "hex"),
    Buffer.from(expectedHash, "hex")
  );
}

function createRawSessionToken() {
  return crypto.randomBytes(48).toString("hex");
}

function hashSessionToken(token) {
  return crypto.createHmac("sha256", getSecret()).update(token).digest("hex");
}

module.exports = {
  validatePassword,
  createPasswordSalt,
  hashPassword,
  verifyPassword,
  createRawSessionToken,
  hashSessionToken,
};
