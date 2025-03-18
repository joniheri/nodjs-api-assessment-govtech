const express = require("express");
const router = express.Router();

// Import Middleware
const {
  verifyToken,
  middlewareLevel,
} = require("../middleware/auth-middleware");

// Import Controller
const {
  getTeachers,
  registerStudents,
  getCommonStudents,
  suspendStudent,
  unSuspendStudent,
  retrieveForNotifications,
} = require("../controllers/teacher-controller");

// Public Endpoint
router.get("/", getTeachers);
router.post("/register", registerStudents);
router.get("/commonstudents", getCommonStudents);
router.post("/suspend", suspendStudent);
router.post("/unsuspend", unSuspendStudent);
router.post("/retrievefornotifications", retrieveForNotifications);

// Protected Endpoint
router.post(
  "/register-protected",
  verifyToken,
  middlewareLevel([1]),
  registerStudents
);

module.exports = router;
