const { connection } = require("../config/database");
const nodemailer = require("nodemailer");
const { cloudinary } = require("../config/cloudinary");

exports.sendVerificationEmail = async (req, res, next) => {
  try {
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
      to: req.user.email,
      subject: "Email verification",
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
      <img src="https://media.giphy.com/media/1oFT5VtJnDuVkZnDlY/giphy.gif" />
    <h1>You are almost there.......</h1>
    <h3>${req.user.verifycode}</h3> is your OTP for account verification.
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
  } catch (err) {
    next(err);
  }
  // res.status(200).json({
  //   success: true,
  //   message: "Email sent successfully",
  //   statusCode: 200,
  // });
};

exports.verifyEmailController = async (req, res, next) => {
  const { code } = req.body;
  const { verifycode } = req.user;
  if (code === verifycode) {
    try {
      connection.query(
        "UPDATE step SET step = '1' WHERE id = ?;",
        [req.user.id],
        (err, result) => {
          if (err) {
            next(err);
          }
        }
      );
      connection.query(
        "UPDATE users SET verifycode = NULL WHERE id = ?;",
        [req.user.id],
        (err, result) => {
          if (err) {
            next(err);
          } else {
            res.status(200).json({
              success: true,
              message: "Email verified successfully",
              statusCode: 200,
            });
          }
        }
      );
    } catch (err) {
      next(err);
    }
  } else {
    res.status(400).json({
      success: false,
      message: "Invalid verification code",
      statusCode: 400,
    });
  }
  // res.status(200).json({
  //   success: true,
  //   message: "Email verified successfully",
  //   statusCode: 200,
  // });
};

exports.personalInfoController = function (req, res, next) {
  const {
    fullname,
    dob,
    fathername,
    mothername,
    complextion,
    height,
    weight,
    habits,
    religion,
    siblings,
    universityname,
    degree,
    passingyear,
    phone,
    parentsphone,
    address,
  } = req.body;
  const { id } = req.user;
  console.log(req.body);
  try {
    if (
      !fullname ||
      !dob ||
      !fathername ||
      !mothername ||
      !complextion ||
      !height ||
      !weight ||
      !habits ||
      !religion ||
      !siblings ||
      !universityname ||
      !degree ||
      !passingyear ||
      !phone ||
      !parentsphone ||
      !address
    ) {
      res.status(400).json({
        message: "Please provide all the fields ee",
        success: false,
        statusCode: 400,
      });
    } else {
      connection.query(
        "INSERT INTO personal_info (id, fullname, dob, age, fathername, mothername, complextion, height, weight, habits, religion, siblings) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
        [
          id,
          fullname,
          dob,
          new Date().getFullYear() - new Date(dob).getFullYear(),
          fathername,
          mothername,
          complextion,
          height,
          weight,
          habits,
          religion,
          siblings,
        ],
        (err, result) => {
          if (err) {
            next(err);
          }
        }
      );
      connection.query(
        "INSERT INTO education_info (id, universityname, degree, passingyear) VALUES (?, ?, ?, ?);",
        [id, universityname, degree, passingyear],
        (err, result) => {
          if (err) {
            next(err);
          }
        }
      );

      connection.query(
        "INSERT INTO contact_info (id, phone, parentsphone, address) VALUES (?, ?, ?, ?);",
        [id, phone, parentsphone, address],
        (err, result) => {
          if (err) {
            next(err);
          } else {
            res.status(200).json({
              success: true,
              message: "Personal info added successfully",
              statusCode: 200,
            });
          }
        }
      );
      connection.query(
        "UPDATE step SET step = '2' WHERE id = ?;",
        [id],
        (err, result) => {
          if (err) {
            next(err);
          }
        }
      );
    }
  } catch (err) {
    next(err);
  }
};
exports.documentsController = async function (req, res, next) {
  const profile = req.files.profilePhoto.tempFilePath;
  const identity = req.files.identity.tempFilePath;
  const degree = req.files.degreeCertificate.tempFilePath;
  try {
    const uploadProfile = await cloudinary.uploader.upload(profile, {
      upload_preset: "perfectpair",
    });
    const uploadIdentity = await cloudinary.uploader.upload(identity, {
      upload_preset: "perfectpair",
    });
    const uploadDegree = await cloudinary.uploader.upload(degree, {
      upload_preset: "perfectpair",
    });
    connection.query(
      "INSERT INTO documents (id, profile, identity, degree) VALUES (?, ?, ?, ?);",
      [req.user.id, uploadProfile.url, uploadIdentity.url, uploadDegree.url],
      (err, result) => {
        if (err) {
          next(err);
        } else {
          res.status(200).json({
            success: true,
            message: "Documents uploaded successfully",
            statusCode: 200,
          });
        }
      }
    );
    connection.query(
      "UPDATE step SET step = '3' WHERE id = ?;",
      [req.user.id],
      (err, result) => {
        if (err) {
          next(err);
        }
      }
    );
  } catch (err) {
    next(err);
  }
};
exports.currentStepController = function (req, res, next) {
  const { id } = req.user;
  connection.query(
    "SELECT step FROM step WHERE id = ?",
    [id],
    (err, result) => {
      if (err) {
        next(err);
      } else {
        res.status(200).json({
          success: true,
          message: "Current step",
          statusCode: 200,
          data: result[0],
        });
      }
    }
  );
};
