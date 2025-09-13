// Core modules
const express = require("express");
const pg = require("pg");

// third party modules
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const router = express.Router();
const routGuard = require("../middleware/verifyToken");

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

router.get("/secret", routGuard, (req, res) => {
  res.send(`Hello ${req.user.username}, this is a protected route`);
});

router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      "INSERT INTO users (username , password) VALUES ($1, $2) RETURNING id, username",
      [username, hashedPassword]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    // if (error.code === "23505") {
    // res.status(409).send("username is already exist");
    // }

    console.log(error);
    res.status(500).send("error registering the user");
  }
});

module.exports = router;

// login process
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await pool.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).send("Invalid credentials");

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (error) {
    console.log(error);
    res.status(500).send("error logging the user");
  }
});
