const crypto = require("crypto");
const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  // const apiKey = req.header("x-api-key");
  // if (!apiKey) return res.status(401).send({ message: "Access Denied. No API Key provided." });
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).send({ message: "Access Denied. No token provided." });

  try {
    req.user = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
    next();
  } catch (ex) {
    res.status(400).send({ message: "Invalid token." });
  }
};
