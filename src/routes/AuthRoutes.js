const express = require("express");
const router = express.Router();

// Import Controller
const {
  register,
  login,
  refreshToken,
} = require("../controllers/AuthController");

router.post("/register", register);
router.post("/login", login);
router.post("/refresh-token", refreshToken);

module.exports = router;
