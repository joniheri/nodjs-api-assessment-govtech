const express = require("express");
const router = express.Router();

// Import Controller
const { getUsers } = require("../controllers/UserController");
const { verifyToken } = require("../middleware/AuthMiddleware");

// router.get("/", getUsers); // public
router.get("/", verifyToken, getUsers); //protected

module.exports = router;
