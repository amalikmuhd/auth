/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Jega");
});

module.exports = router;
