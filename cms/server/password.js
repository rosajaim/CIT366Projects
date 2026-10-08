const crypto = require("node:crypto");
const { promisify } = require("node:util");
const scrypt = promisify(crypto.scrypt);
async function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const key = await scrypt(password, salt, 64, {
    N: 32768,
    r: 8,
    p: 3,
    maxmem: 64 * 1024 * 1024,
  });
  return `scrypt-v1$${salt}$${key.toString("hex")}`;
}
async function checkPassword(password, hash) {
  const [, salt, expected] = hash.split("$");
  const actual = await scrypt(password, salt, 64, {
    N: 32768,
    r: 8,
    p: 3,
    maxmem: 64 * 1024 * 1024,
  });
  return crypto.timingSafeEqual(actual, Buffer.from(expected, "hex"));
}
module.exports = { hashPassword, checkPassword };
