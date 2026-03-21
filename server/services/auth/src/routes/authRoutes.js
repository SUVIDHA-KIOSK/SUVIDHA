const express = require("express");
const {
  requestOtp,
  verifyOtp,
  getProfile,
} = require("../controllers/authController");

const router = express.Router();

router.post("/login/otp", requestOtp);
router.post("/login/verify", verifyOtp);
router.get("/profile", getProfile);

module.exports = router;
