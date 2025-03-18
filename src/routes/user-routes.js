const express = require("express");
const router = express.Router();

// Import Controller
const { getUsers } = require("../controllers/user-controller");
const { verifyToken } = require("../middleware/auth-middleware");

// router.get("/", getUsers); // public
router.get("/", verifyToken, getUsers); //protected

module.exports = router;
