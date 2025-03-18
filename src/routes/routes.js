const express = require("express");
const router = express.Router();

// Import All Routes
const authRoutes = require("./auth-routes");
const protectedRoutes = require("./protected-routes");
const userRoutes = require("./user-routes");
const teacherRoutes = require("./teacher-routes");
const studentRoutes = require("./student-routes");

// Definisikan semua route
router.use("/auth", authRoutes); // Auth Routes
router.use("/protected-route", protectedRoutes); // Middleware/Auth Route Private (Butuh Token)
router.use("/users", userRoutes); // User Routes
router.use("/teachers", teacherRoutes); // Teacher Routes
router.use("/students", studentRoutes); //

module.exports = router;
