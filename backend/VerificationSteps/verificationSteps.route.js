const express = require("express");
const {
  verifyEmailController,
  sendVerificationEmail,
  currentStepController,
  personalInfoController,
  documentsController,
} = require("./verificationSteps.controller");
const router = express.Router();
const protectedRoute = require("../middlewares/protectedRoute");

router
  .route("/send-verification-email")
  .post(protectedRoute, sendVerificationEmail);
router.route("/1").post(protectedRoute, verifyEmailController);
router.route("/2").post(protectedRoute, personalInfoController);
router.route("/3").post(protectedRoute, documentsController);
router.route("/current-step").get(protectedRoute, currentStepController);

module.exports = router;
