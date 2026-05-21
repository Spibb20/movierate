process.env.NODE_ENV = "test";
process.env.AUTH_SECRET = "test-secret-123456789012345678901234";

const test = require("node:test");
const assert = require("node:assert/strict");
const app = require("../server/index");
const User = require("../server/models/User");
const Session = require("../server/models/Session");
const { hashPassword, verifyPassword } = require("../server/utils/auth");

let server;
let baseUrl;
let savedUser;
let savedSession;

function makeUser(overrides = {}) {
  return {
    _id: "user123",
    name: "Tester",
    email: "tester@example.com",
    role: "user",
    favorites: [],
    avatar: "",
    failedLoginAttempts: 0,
    lockUntil: null,
    async save() {
      savedUser = this;
      return this;
    },
    ...overrides,
  };
}

async function request(path, options = {}) {
  const { headers, ...rest } = options;
  const res = await fetch(`${baseUrl}${path}`, {
    ...rest,
    headers: { "Content-Type": "application/json", ...(headers || {}) },
  });
  const body = await res.json().catch(() => ({}));
  return { res, body };
}

test.before(async () => {
  server = app.listen(0);
  await new Promise((resolve) => server.once("listening", resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

test.after(async () => {
  await new Promise((resolve) => server.close(resolve));
});

test.beforeEach(() => {
  savedUser = null;
  savedSession = null;
  User.findOne = async () => null;
  User.create = async (data) => makeUser(data);
  Session.create = async (data) => {
    savedSession = data;
    return data;
  };
  Session.deleteOne = async () => ({ deletedCount: 1 });
  Session.findOne = () => ({ populate: async () => savedSession });
});

test("Нууц үгийн хэш функц", async () => {
  const first = await hashPassword("Strong@123");
  const second = await hashPassword("Strong@123");
  assert.notEqual(first.salt, second.salt);
  assert.notEqual(first.hash, second.hash);
  assert.equal(
    await verifyPassword("Strong@123", first.salt, first.hash),
    true
  );
  assert.equal(
    await verifyPassword("Wrong@123", first.salt, first.hash),
    false
  );
});

test("Хэрэглэгч бүртгүүлэх passwordHash and passwordSalt", async () => {
  const { res, body } = await request("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify({
      name: "Tester",
      email: "tester@example.com",
      password: "Strong@123",
    }),
  });
  assert.equal(res.status, 201);
  assert.equal(body.email, "tester@example.com");
  assert.equal(Boolean(body.passwordHash), false);
});

test("Системд нэвтрэх sets HttpOnly cookie, and wrong password fails", async () => {
  const record = await hashPassword("Strong@123");
  savedUser = makeUser({
    passwordHash: record.hash,
    passwordSalt: record.salt,
  });
  User.findOne = async () => savedUser;

  const bad = await request("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email: savedUser.email, password: "Wrong@123" }),
  });
  assert.equal(bad.res.status, 401);

  const good = await request("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email: savedUser.email, password: "Strong@123" }),
  });
  assert.equal(good.res.status, 200);
  assert.match(good.res.headers.get("set-cookie"), /session=.*HttpOnly/);
  assert.ok(savedSession.tokenHash);
});

test("Профайл зураг солих", async () => {
  const cookie = "session=fake-token";
  savedSession = {
    _id: "session123",
    user: makeUser(),
    expiresAt: new Date(Date.now() + 60000),
  };
  const { res, body } = await request("/api/users/me", {
    method: "PUT",
    headers: { Cookie: cookie },
    body: JSON.stringify({ avatar: "data:image/png;base64,abc" }),
  });
  assert.equal(res.status, 200);
  assert.equal(body.avatar, "data:image/png;base64,abc");
});

test("Системээс гарах", async () => {
  savedSession = {
    _id: "session123",
    user: makeUser(),
    expiresAt: new Date(Date.now() + 60000),
  };
  const { res, body } = await request("/api/auth/logout", {
    method: "POST",
    headers: { Cookie: "session=fake-token" },
  });
  assert.equal(res.status, 200);
  assert.deepEqual(body, { ok: true });
});
