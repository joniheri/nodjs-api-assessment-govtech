const jwt = require("jsonwebtoken");
const { User: UserModel } = require("../../models");

exports.verifyToken = async (req, res, next) => {
  try {
    // Periksa apakah header `Authorization` ada
    const header = req.header("Authorization");
    if (!header) {
      return res.status(401).send({
        status: "fail",
        message: "Access Denied. Authorization header required",
      });
    }

    // Ambil token dari header
    const token = header.replace("Bearer ", "").trim();
    console.log("Token dari request:", token);

    if (!token) {
      return res.status(401).send({
        status: "fail",
        message: "Access Denied. Token required",
      });
    }

    // Verifikasi token JWT
    let decode;
    try {
      decode = jwt.verify(token, process.env.ACCESS_SECRET_KEY);
    } catch (err) {
      console.error("JWT Verification Error:", err.message);
      return res.status(401).send({
        status: "fail",
        message: "Access Denied. Invalid or expired token",
      });
    }

    console.log("Token Decoded:", decode);

    // Ambil user dari database berdasarkan ID di token
    const user = await UserModel.findByPk(decode.id);
    if (!user) {
      return res.status(404).send({
        status: "fail",
        message: `Access to User with ID: ${decode.id} not found`,
      });
    }

    // Simpan informasi user ke `req.user`
    req.user = user;
    return next();
  } catch (error) {
    console.error("Middleware Error:", error.message);
    return res.status(500).send({
      status: "fail",
      message: "Internal server error",
    });
  }
};

// Middleware baru untuk membatasi akses hanya untuk user dengan level = 1
exports.middlewareLevel = (allowedLevels) => {
  return async (req, res, next) => {
    try {
      // Pastikan user sudah diautentikasi
      if (!req.user) {
        return res.status(403).send({
          status: "fail",
          message: "Access Denied. User not authenticated",
        });
      }

      // Ambil level user dari request
      const userLevel = req.user.level;
      console.log(
        `🔍 Checking User Level: ${userLevel} (Allowed: ${allowedLevels})`
      );

      // Periksa apakah level user termasuk yang diperbolehkan
      if (!allowedLevels.includes(userLevel)) {
        return res.status(403).send({
          status: "fail",
          message:
            "Access Denied. Insufficient permissions or Level user not allowed",
        });
      }

      return next();
    } catch (error) {
      console.error("Middleware Level Error:", error.message);
      return res.status(500).send({
        status: "fail",
        message: "Internal server error",
      });
    }
  };
};
