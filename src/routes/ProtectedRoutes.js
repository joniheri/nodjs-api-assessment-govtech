const express = require("express");
const { verifyToken } = require("../middleware/AuthMiddleware");

const router = express.Router();

router.get("/", verifyToken, (req, res) => {
  res.send({ message: "Success! You have access." });
});

module.exports = router;
