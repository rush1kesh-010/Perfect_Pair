const express = require("express");
const adminProtectedRoute = require("../middlewares/adminProtectedRoute.js");
const router = express.Router();
const {
  signinAdmin,
  verifyUsers,
  getNonVerifiedUsers,
  getUserProfilesForAdmin,
  approveUser,
  rejectRequest,
  verifyAdmin,
} = require("./admin.controller");

router.route("/signin").post(signinAdmin);
router.route("/verify").post(adminProtectedRoute, verifyUsers);
router
  .route("/non-verified-users")
  .get(adminProtectedRoute, getNonVerifiedUsers);
router
  .route("/user-profile/:id")
  .get(adminProtectedRoute, getUserProfilesForAdmin);
router.route("/approve-user/:id").post(adminProtectedRoute, approveUser);
router.route("/reject-request/:id").post(adminProtectedRoute, rejectRequest);
router.route("/verify-admin").get(adminProtectedRoute, verifyAdmin);

module.exports = router;
