const jwt = require("jsonwebtoken");
const { connection } = require("../config/database");
const protectedRoute = async (req, res, next) => {
  const token = req.headers.authorization;
  try {
    if (token.startsWith("Bearer ")) {
      const token = req.headers.authorization.split(" ")[1];
      const result = await jwt.verify(token, process.env.TOKEN_SECRET);
      if (result) {
        connection.query(
          "SELECT * FROM users WHERE id = ?",
          [result.id],
          (err, result) => {
            if (err) {
              next(err);
            } else {
              if (result.length > 0) {
                req.user = result[0];
                next();
              } else {
                res.status(401).json({
                  success: false,
                  message: "Invalid credentials",
                  statusCode: 401,
                });
              }
            }
          }
        );
      }
    } else {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
        statusCode: 401,
      });
    }
  } catch (err) {
    res.status(401).json({
      success: false,
      message: "Unauthorized",
      statusCode: 401,
    });
  }
};
module.exports = protectedRoute;
