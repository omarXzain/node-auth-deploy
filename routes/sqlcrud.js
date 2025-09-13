const express = require("express");
const axios = require("axios");
const router = express.Router();
const pg = require("pg");
const routGuard = require("../middleware/verifyToken");

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

router.get("/showAll", routGuard, async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM pets");
    console.log("show the result", result.rows);

    res.json(result.rows);
  } catch (error) {
    res.status(500).send("Error fetching", error); // internal server error
    console.log("Error fetching", error);
  }
});

// new method to insert data to postgres db
router.post("/insert", async (req, res) => {
  console.log(res.body, req.body);

  const { name, type, age } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO pets (name, type, age) VALUES ( $1, $2, $3 ) RETURNING *",
      [name, type, age]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.log("Error inserting data", error);
    res.status(500).send("error");
  }
});

// new method to update data
router.put("/update/:id", async (req, res) => {
  const { id } = req.params;
  const { name, type, age } = req.body;

  try {
    const result = await pool.query(
      "UPDATE pets SET name=$1, type=$2, age=$3 WHERE id=$4 RETURNING *",
      [name, type, age, id]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.log("Error updating data", error);
    res.status(500).send("error");
  }
});

module.exports = router;
