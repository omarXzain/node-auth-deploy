require("dotenv").config();
const jwt = require("jsonwebtoken");

function routeGuard(req, res, next) {
  const authHeader = req.headers["authorization"];

  const tokenFromHeader = authHeader && authHeader.split(" ")[1];
  const tokenFromQuery = req.query.token;

  const token = tokenFromHeader || tokenFromQuery;

  if (!token) return res.status(401).send("Access denied. no token provided");

  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decode;

    next(); // tell express to continue to the next step ( middleware or route ...)
  } catch (error) {
    return res.status(403).send("invalid or expired token");
  }
}

module.exports = routeGuard;

// http://localhost:4023/user/secret?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJFJ2M-cAKGLU6KzvakB7E

// https://api.spoonacular.com/recipes/findByIngredients?ingredients=apples,flour,sugar&apiKey= PUT YOUR OWN API KEY HERE AFTER
