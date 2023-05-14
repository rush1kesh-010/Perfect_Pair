const { connection } = require("../config/database");
const { comparePassword } = require("../utils/passwordUtils");
const jwt = require("jsonwebtoken");

exports.signinAdmin = async (req, res, next) => {
  console.log("signin admin");
  const { email, password } = req.body;
  try {
    connection.query(
      "SELECT * FROM admin WHERE email = ?;",
      [email],
      async (err, result) => {
        if (err) {
          next(err);
        } else if (result.length === 0) {
          res.status(400).json({
            success: false,
            message: "Invalid email or password",
            statusCode: 400,
          });
        } else {
          const { id, email, password: hash } = result[0];
          const isMatch = await comparePassword(password, hash);
          if (isMatch) {
            const token = await jwt.sign(
              { id, email, role: "admin" },
              process.env.TOKEN_SECRET,
              {
                expiresIn: "1h",
              }
            );

            res.status(200).json({
              success: true,
              message: "Admin logged in successfully",
              statusCode: 200,
              token: `Bearer ${token}`,
              user: {
                id,
                email,
              },
            });
          } else {
            res.status(400).json({
              success: false,
              message: "Invalid email or password",
              statusCode: 400,
            });
          }
        }
      }
    );
  } catch (err) {
    next(err);
  }
};
exports.getNonVerifiedUsers = async (req, res, next) => {
  try {
    connection.query(
      "SELECT users.id, name, gender,age, step, address,dob, religion, profile FROM users,step,documents,personal_info, contact_info WHERE users.id = contact_info.id AND users.id = step.id AND step.step = '3' AND users.id = documents.id AND users.id = personal_info.id",
      (err, result) => {
        if (err) {
          next(err);
        } else {
          res.status(200).json({
            success: true,
            message: "Non verified users",
            statusCode: 200,
            users: result,
          });
        }
      }
    );
  } catch (err) {
    next(err);
  }
};
exports.verifyUsers = async (req, res, next) => {
  const { id } = req.body;
  try {
    connection.query(
      "UPDATE step SET step = '4' WHERE id = ?; UPDATE users SET verifiedby = ? WHERE id = ?;",
      [id, req.user.id, id],
      (err, result) => {
        if (err) {
          next(err);
        } else {
          res.status(200).json({
            success: true,
            message: "User verified successfully",
            statusCode: 200,
          });
        }
      }
    );
  } catch (err) {
    next(err);
  }
};

exports.getVerifiedUsersByAdmin = async (req, res, next) => {
  try {
    connection.query(
      "SELECT * FROM users, step WHERE users.id = step.id AND step.step = '4';",
      (err, result) => {
        if (err) {
          next(err);
        } else {
          res.status(200).json({
            success: true,
            message: "Verified users",
            statusCode: 200,
            users: result,
          });
        }
      }
    );
  } catch (err) {
    next(err);
  }
};

exports.getUserProfilesForAdmin = async (req, res, next) => {
  const { id } = req.params;
  try {
    connection.query(
      "SELECT *, education_info.degree as degreeInfo FROM users, education_info, personal_info, contact_info, documents, step WHERE users.id = ? AND users.id = personal_info.id AND users.id = contact_info.id AND users.id = documents.id AND users.id = education_info.id AND users.id = step.id;",
      [id],
      (err, result) => {
        if (err) {
          next(err);
        } else {
          res.status(200).json({
            success: true,
            message: "User profile",
            statusCode: 200,
            user: result[0],
          });
        }
      }
    );
  } catch (err) {
    next(err);
  }
};
exports.approveUser = async (req, res, next) => {
  const { id } = req.params;
  try {
    connection.query(
      "UPDATE step SET step = '4' WHERE id = ?; UPDATE users SET verifiedby = ? WHERE id = ?;",
      [id, req.user.id, id],
      (err, result) => {
        if (err) {
          next(err);
        } else {
          res.status(200).json({
            success: true,
            message: "User approved successfully",
            statusCode: 200,
          });
        }
      }
    );
  } catch (err) {
    next(err);
  }
};
exports.rejectRequest = (req, res, next) => {
  const { id } = req.params;
  connection.query("DELETE FROM users WHERE id = ?;", [id], (err, result) => {
    if (err) next(err);
    else {
      res.status(200).json({
        success: true,
        message: "Interest rejected",
        statusCode: 200,
      });
    }
  });
};

exports.verifyAdmin = async (req, res, next) => {
  const { id } = req.user;
  res.send({
    success: true,
    id: id,
  });
};
