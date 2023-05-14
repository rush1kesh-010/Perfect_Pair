const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
exports.hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPass = await bcrypt.hash(password, salt);
  return hashedPass;
};
exports.comparePassword = async (originalPassword, hashPassword) => {
  return await bcrypt.compare(originalPassword, hashPassword);
};
exports.generateToken = (payload) => {
  return jwt.sign(payload, process.env.TOKEN_SECRET, {
    expiresIn: process.env.TOKEN_EXPIRES_IN,
  });
};
exports.generateEmailVerificationCode = (payload) => {
  return jwt.sign(payload, process.env.EMAIL_VERIFY_SECRET, {
    expiresIn: "30m",
  });
};
