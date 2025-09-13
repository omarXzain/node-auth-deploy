const express = require("express");
const router = express.Router();
const path = require("path");

router.get("/", (req, res) => {
  console.log("THIS IS THE PATH", __filename);
  res.sendFile(path.join(__dirname, "../public/getStarted.html"));
});

module.exports = router;
