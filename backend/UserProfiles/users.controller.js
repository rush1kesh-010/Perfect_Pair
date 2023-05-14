const { connection } = require("../config/database");
const nodemailer = require("nodemailer");

exports.users = (req, res, next) => {
  connection.query(
    "SELECT users.id, name, gender,age, step, address,dob, religion, profile FROM users,step,documents,personal_info, contact_info WHERE users.id = contact_info.id AND users.id = step.id AND step.step = '4' AND users.id = documents.id AND users.id = personal_info.id",
    [],
    (err, result) => {
      if (err) next(err);
      else {
        res.send({
          result: result,
        });
      }
    }
  );
};
exports.filteredUsers = (req, res, next) => {
  const data = req.query;
  console.log(data);
  connection.query(
    "SELECT users.id, name, gender,age, step, address,dob, religion, profile FROM users,step,documents,personal_info, contact_info WHERE users.id = contact_info.id AND users.id = step.id AND step.step = '4' AND users.id = documents.id AND users.id = personal_info.id AND age > ? AND age <= ? AND gender = ? AND religion = ?",
    [
      data.age.split("-")[0],
      data.age.split("-")[1],
      data.gender,
      data.religion,
    ],
    (err, result) => {
      if (err) next(err);
      else {
        res.send({
          result: result,
        });
      }
    }
  );
};
exports.user = (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    res.status(400).json({
      message: "Please provide id",
      success: false,
      statusCode: 400,
    });
  } else {
    connection.query(
      "SELECT id, name, email, gender FROM users WHERE id = ?",
      [id],
      (err, result) => {
        if (err) next(err);
        else {
          if (result.length > 0) {
            res.send({
              result: result,
            });
          } else {
            res.status(404).json({
              message: "User not found",
              success: false,
              statusCode: 404,
            });
          }
        }
      }
    );
  }
};
exports.personalInfoController = (req, res, next) => {
  const { id } = req.params;
  connection.query(
    "SELECT * FROM personal_info WHERE id = ?",
    [id],
    (err, result) => {
      if (err) next(err);
      else {
        if (result.length > 0) {
          res.send({
            result: result[0],
          });
        } else {
          res.status(404).json({
            message: "User not found",
            success: false,
            statusCode: 404,
          });
        }
      }
    }
  );
};
exports.documentsInfoController = (req, res, next) => {
  const { id } = req.params;
  connection.query(
    "SELECT * FROM documents WHERE id = ?",
    [id],
    (err, result) => {
      if (err) next(err);
      else {
        if (result.length > 0) {
          res.send({
            result: result[0],
          });
        } else {
          res.status(404).json({
            message: "User not found",
            success: false,
            statusCode: 404,
          });
        }
      }
    }
  );
};

exports.educationInfoController = (req, res, next) => {
  const { id } = req.params;
  connection.query(
    "SELECT * FROM education_info WHERE id = ?",
    [id],
    (err, result) => {
      if (err) next(err);
      else {
        if (result.length > 0) {
          res.send({
            result: result[0],
          });
        } else {
          res.status(404).json({
            message: "User not found",
            success: false,
            statusCode: 404,
          });
        }
      }
    }
  );
};

exports.contactInfoController = (req, res, next) => {
  const { id } = req.params;
  connection.query(
    "SELECT * FROM contact_info WHERE id = ?",
    [id],
    (err, result) => {
      if (err) next(err);
      else {
        if (result.length > 0) {
          res.send({
            result: result[0],
          });
        } else {
          res.status(404).json({
            message: "User not found",
            success: false,
            statusCode: 404,
          });
        }
      }
    }
  );
};

exports.showInterest = (req, res, next) => {
  const { id } = req.user;
  const { interest } = req.params;
  connection.query(
    "INSERT INTO interests (id, interested) VALUES (?, ?); select email from users where id = ?",
    [id, interest, interest],
    (err, result) => {
      if (err) next(err);
      else {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          secure: false,
          auth: {
            user: "perfect.pair.mail@gmail.com",
            pass: "qdrlsgcxwwflaito",
          },
        });
        const mailOptions = {
          from: "perfect.pair.mail@gmail.com",
          to: result[1][0].email,
          subject: "Someone has shown interest in you",
          html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta http-equiv="X-UA-Compatible" content="ie=edge">
            <title>Static Template</title>
            <style>
            html {
              width: max-content;
              padding: 1rem;
              border: 1px solid black;
              border-radius: 8px;
              /* text-align: center; */
            }
              h1 {

              }
              h3 {
                display: inline

              }
            </style>
          </head>
          <body>
            <h1>Greetings From Perfect Pair!</h1>
            <p>${req.user.name} has shown interest in you. Check out their profile at http://localhost:3000/profile/${req.user.id}</p>
          </body>
        </html>`,
        };
        transporter.sendMail(mailOptions, function (err, info) {
          if (err) {
            next(err);
          } else {
            res.status(200).json({
              success: true,
              message: "Email sent successfully",
              statusCode: 200,
            });
          }
        });
      }
    }
  );
};

exports.getInterests = (req, res, next) => {
  const { id } = req.user;
  const { interest } = req.params;
  connection.query(
    "SELECT interested FROM interests WHERE id = ? AND interested = ?",
    [id, interest],
    (err, result) => {
      if (err) next(err);
      else {
        res.send({
          result: result,
        });
      }
    }
  );
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
