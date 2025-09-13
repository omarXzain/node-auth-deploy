// npm istall -g nodemon

require("dotenv").config(); // npm install dotenv

// step 1 // npm install express
const express = require("express");
var cors = require("cors");

const pg = require("pg");

// step 2 // initialze the express app
const app = express(); // used to define the routes and middlewares

app.use(express.json()); // it pasre Json request body

app.use(cors()); // allowing all other domains to hit your api

const client = new pg.Client(process.env.DATABASE_URL);
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

const postRoutes = require("./routes/posts");
const homeRoutes = require("./routes/home");
const sqlCrud = require("./routes/sqlcrud");
const auth = require("./routes/auth");

// middleware serve the static files from public directory
// app.use(express.static("public"));

// Routing
app.use("/api", postRoutes);
app.use("/home", homeRoutes);
app.use("/pets", sqlCrud);
app.use("/user", auth);

// middleware
app.use((req, res) => {
  res.status(500).send("Page Not Found <a href='/'> go to home </a>");

  //   res.redirect("/");
});

const port = process.env.PORT || 3000;

// pool
//   .connect()
//   .then(() => {
app.listen(port, () => {
  console.log(`App is listning on port http://localhost:${port}`);
});
// })
// .catch((err) => {
//   console.error("Could not connect to database:", err);
// });

// pool
//   .connect()
//   .then((client) => {
//     return client
//       .query("SELECT current_database(), current_user")
//       .then((res) => {
//         client.release();

//         const dbName = res.rows[0].current_database;
//         const dbUser = res.rows[0].current_user;

//         console.log(
//           `Connected to PostgreSQL as user '${dbUser}' on database '${dbName}'`
//         );

//         console.log(`App listening on port http://localhost:${port}`);
//       });
//   })
//   .then(() => {
//     app.listen(port);
//   })
//   .catch((err) => {
//     console.error("Could not connect to database:", err);
//   });
