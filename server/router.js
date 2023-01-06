const express = require("express");
const cors = require("cors");

const router = express.Router();

router.get("/", cors(), (req, res) => {
  res.send("server is up and running");
});

module.exports = router;
