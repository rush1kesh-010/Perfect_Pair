const { connection } = require("../config/database");
const {
  hashPassword,
  comparePassword,
  generateToken,
} = require("../utils/passwordUtils");
// hashPassword("admin@123").then((data) => console.log(data));
exports.signupUserController = async (req, res, next) => {
  console.log(req.body);
  let { name, email, gender, password } = req.body;
  try {
    connection.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
      async (err, result) => {
        if (err) {
          next(err);
        } else {
          if (result.length > 0) {
            res.status(403).json({
              success: false,
              message: "Email already exists",
            });
          } else {
            password = await hashPassword(password);
            const emailSecretCode = Math.floor(100000 + Math.random() * 900000);
            connection.query(
              "INSERT INTO users(name, email, gender, password, verifycode) VALUES(?, ?, ?, ?, ?); INSERT INTO step(id) VALUES(LAST_INSERT_ID());",
              [name, email, gender, password, emailSecretCode],
              (err, result) => {
                if (err) {
                  next(err);
                } else {
                  res.status(200).json({
                    message: "User created successfully",
                  });
                }
              }
            );
          }
        }
      }
    );
  } catch (err) {
    next(err);
  }
};

exports.loginUserController = async (req, res) => {
  let { email, password } = req.body;
  try {
    if (!email || !password) {
      res.status(400).json({
        message: "Please provide email and password",
        success: false,
        statusCode: 400,
      });
    } else {
      connection.query(
        "SELECT * FROM users WHERE email = ?",
        [email],
        async (err, result) => {
          if (err) {
            next(err);
          } else {
            if (result.length > 0) {
              const isMatch = await comparePassword(
                password,
                result[0].password
              );
              if (isMatch) {
                const token = generateToken({
                  email: result[0].email,
                  id: result[0].id,
                });
                res.status(200).json({
                  success: true,
                  message: "User logged in successfully",
                  token: token,
                  user: {
                    id: result[0].id,
                    name: result[0].name,
                    email: result[0].email,
                    gender: result[0].gender,
                  },
                  statusCode: 200,
                });
              } else {
                res.status(401).json({
                  success: false,
                  message: "Invalid credentials",
                  statusCode: 401,
                });
              }
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
  } catch (err) {
    next(err);
  }
};

exports.verifyUserController = async (req, res, next) => {
  res.status(200).json({
    success: true,
    message: "User verified successfully",
    data: {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
    },
    statusCode: 200,
  });
};
