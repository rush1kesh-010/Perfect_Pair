const jwt = require("jsonwebtoken");
const { connection } = require("../config/database");
const adminProtectedRoute = async (req, res, next) => {
  let token = req.headers.authorization;

  try {
    if (token && token.startsWith("Bearer ")) {
      token = token.split(" ")[1];
    } else {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
        statusCode: 401,
      });
      return;
    }
    const decoded = await jwt.verify(token, process.env.TOKEN_SECRET);
    if (decoded && decoded.role === "admin") {
      connection.query(
        "SELECT * FROM admin WHERE id = ?",
        [decoded.id],
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
                message: "Unauthorized",
                statusCode: 401,
              });
            }
          }
        }
      );
    } else {
      res.status(403).json({
        message: "You are not authorized to access this route",
        success: false,
        statusCode: 403,
      });
    }
  } catch (err) {
    next(err);
  }
};
module.exports = adminProtectedRoute;
