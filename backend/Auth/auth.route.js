const express = require("express");
const protectedRoute = require("../middlewares/protectedRoute");
const router = express.Router();
const {
  signupUserController,
  loginUserController,
  verifyUserController,
} = require("./auth.controller");

// signup route
router.route("/signup").post(signupUserController);
router.route("/login").post(loginUserController);
// verify user authentification
router.route("/verify-user").get(protectedRoute, verifyUserController);
module.exports = router;
