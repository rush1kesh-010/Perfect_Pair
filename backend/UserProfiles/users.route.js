const express = require("express");
const protectedRoute = require("../middlewares/protectedRoute");
const {
  users,
  user,
  personalInfoController,
  documentsInfoController,
  educationInfoController,
  contactInfoController,
  filteredUsers,
  showInterest,
  getInterests,
  rejectRequest,
} = require("./users.controller");
const router = express.Router();

router.route("/").get(protectedRoute, users);
router.route("/filter").get(filteredUsers);
router.route("/:id").get(protectedRoute, user);
router.route("/:id/personal-info").get(protectedRoute, personalInfoController);
router
  .route("/:id/education-info")
  .get(protectedRoute, educationInfoController);
router.route("/:id/contact-info").get(protectedRoute, contactInfoController);
router.route("/:id/documents").get(protectedRoute, documentsInfoController);
router.route("/show-interest/:interest").post(protectedRoute, showInterest);
router.route("/get-interests/:interest").get(protectedRoute, getInterests);
router.route("/reject-request/:id").get(protectedRoute, rejectRequest);

module.exports = router;
