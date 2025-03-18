const express = require("express");
const router = express.Router();

// Import Middleware
const {
  verifyToken,
  middlewareLevel,
} = require("../middleware/auth-middleware");

// Import Controller
const {
  createTeacher,
  getTeachers,
  updateTeacher,
  deleteTeacher,
} = require("../controllers/teacher-controller");

router.post("/", verifyToken, middlewareLevel([1]), createTeacher); // protected
router.get("/", verifyToken, middlewareLevel([1]), getTeachers); // protected
router.patch("/:id", verifyToken, middlewareLevel([1]), updateTeacher); // protected
router.delete("/:id", verifyToken, middlewareLevel([1]), deleteTeacher); // protected

module.exports = router;
