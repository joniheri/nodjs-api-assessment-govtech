const express = require("express");
const router = express.Router();

// Import Middleware
const {
  verifyToken,
  middlewareLevel,
} = require("../middleware/auth-middleware");

// Import Controller
const {
  createStudent,
  getStudents,
  getStudent,
  updateStudent,
  deleteStudent,
} = require("../controllers/student-controller");

// Endpoint
router.post("/", verifyToken, middlewareLevel([1]), createStudent);
router.get("/", verifyToken, middlewareLevel([1]), getStudents);
router.get("/:id", verifyToken, middlewareLevel([1]), getStudent);
router.patch("/:id", verifyToken, middlewareLevel([1]), updateStudent);
router.delete("/:id", verifyToken, middlewareLevel([1]), deleteStudent);

module.exports = router;
