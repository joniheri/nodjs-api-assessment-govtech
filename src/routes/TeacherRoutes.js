const express = require("express");
const router = express.Router();

// Import Controller
const { createTeacher } = require("../controllers/TeacherController");
const {
  verifyToken,
  middlewareLevel,
} = require("../middleware/AuthMiddleware");

router.post("/", verifyToken, middlewareLevel([1]), createTeacher); // protected

module.exports = router;
