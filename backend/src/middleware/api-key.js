/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  // const secret = 'abcdefg';
  // const hash = createHmac('sha256', secret).update('I love cupcakes').digest('hex');
  // console.log(hash);
  const apiKey = req.header("x-api-key");
  if (!apiKey) return res.status(401).send({ message: "Access Denied. No API Key provided." });

  // try {
  //   req.user = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
  //   next();
  // } catch (ex) {
  //   res.status(400).send({ message: 'Invalid token.' });
  // }
};
