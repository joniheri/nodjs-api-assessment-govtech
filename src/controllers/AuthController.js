const { User: UserModel, Log: LogModel } = require("../../models");
const { v4: uuidv4 } = require("uuid");
const joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");

exports.register = async (req, res) => {
  try {
    const dataInput = req.body;

    // Validasi input
    const validationSchema = joi.object({
      email: joi.string().email().trim().required(),
      username: joi.string().min(3).trim().required(),
      fullName: joi.string().min(3).trim().required(),
      password: joi.string().min(5).trim().required(),
      // level: joi.number().integer().min(1).required(),
    });

    const { error } = validationSchema.validate(dataInput);
    if (error) {
      return res.status(400).send({
        status: "fail",
        message: error.details[0].message,
      });
    }

    // Cek apakah email atau username sudah terdaftar
    const existingUser = await UserModel.findOne({
      where: {
        [Op.or]: [{ email: dataInput.email }, { username: dataInput.username }],
      },
    });
    if (existingUser) {
      let message = "Username already exists";
      if (
        existingUser.email === dataInput.email &&
        existingUser.username === dataInput.username
      ) {
        message = "Email and username already exist";
      } else if (existingUser.email === dataInput.email) {
        message = "Email already exists";
      }
      return res.status(400).send({ status: "fail", message });
    }

    // Hash password sebelum disimpan
    const hashedPassword = await bcrypt.hash(dataInput.password, 10);

    // Simpan user ke database
    const newUser = await UserModel.create({
      email: dataInput.email,
      username: dataInput.username,
      fullName: dataInput.fullName,
      password: hashedPassword,
      level: 2,
      status: "active",
    });

    // Response tanpa menampilkan password
    return res.status(201).send({
      status: "success",
      message: "User registered successfully",
      user: {
        id: newUser.id,
        email: newUser.email,
        username: newUser.username,
        fullName: newUser.fullName,
        level: newUser.level,
        status: newUser.status,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      status: "fail",
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const dataInput = req.body;
    const dateNow = new Date();
    const jamSekarang = dateNow.toISOString().slice(0, 19).replace("T", " ");

    // ValidationInput
    const validationInput = joi.object({
      email: joi.string().required().min(5).email(),
      password: joi.string().required().min(5),
    });
    const validationError = validationInput.validate(dataInput).error;
    if (validationError) {
      return res.status(400).send({
        status: "fail",
        message: validationError.details[0].message,
      });
    }
    // End ValidationInput

    // CheckEmailAlreadyExist
    const dataUserByEmail = await UserModel.findOne({
      where: {
        email: dataInput.email,
      },
    });
    if (!dataUserByEmail) {
      return res.status(400).send({
        status: "fail",
        message: `User with email: ${dataInput.email} Not Found`,
      });
    }
    // End CheckEmailAlreadyExist

    // CheckUserActive
    if (dataUserByEmail.status !== "active") {
      return res.status(400).send({
        status: "fail",
        message: `User is not active. Please contact admin.`,
      });
    }

    // ComparePassword
    const comparePassword = await bcrypt.compare(
      dataInput.password,
      dataUserByEmail.password
    );
    if (!comparePassword) {
      return res.status(400).send({
        status: "fail",
        message: `Wrong Password`,
      });
    }
    // End ComparePassword

    // MakeToken
    const token = jwt.sign(
      {
        id: dataUserByEmail.id,
      },
      process.env.ACCESS_SECRET_KEY,
      { expiresIn: "1d" } // Token berlaku 1 hari
    );
    // End MakeToken

    // MakeRefreshToken
    const refreshToken = jwt.sign(
      {
        id: dataUserByEmail.id,
      },
      process.env.REFRESH_SECRET_KEY,
      { expiresIn: "7d" } // Refresh Token berlaku 7 hari
    );
    // End MakeToken

    // Simpan refreshToken di database
    await UserModel.update(
      { refreshToken },
      {
        where: { id: dataUserByEmail.id },
      }
    );

    // InsertToTableLog
    await LogModel.create({
      id: uuidv4(),
      userId: dataUserByEmail.id,
      timeLogin: jamSekarang,
    });
    // End InsertToTableLog

    return res.send({
      status: "success",
      message: `Login Success`,
      user: {
        id: dataUserByEmail.id,
        email: dataUserByEmail.email,
        username: dataUserByEmail.username,
        fullName: dataUserByEmail.fullName,
        level: dataUserByEmail.level,
      },
      token: token,
      refreshToken: refreshToken,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      status: "fail",
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(401).send({ message: "Refresh token is required" });
    }

    // Cek apakah refresh token valid
    const user = await UserModel.findOne({ where: { refreshToken } });
    if (!user) {
      return res.status(403).send({ message: "Invalid refresh token" });
    }

    // Verifikasi refresh token
    jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY, (err, decoded) => {
      if (err) {
        return res.status(403).send({ message: "Invalid refresh token" });
      }

      // Buat access token baru
      const newAccessToken = jwt.sign(
        { id: user.id },
        process.env.ACCESS_SECRET_KEY,
        { expiresIn: "1d" }
      );

      res.send({ token: newAccessToken });
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.checkToken = async (req, res) => {
  try {
    const userDecode = req.user;

    // CheckUserById
    const dataUserById = await UserModel.findOne({
      where: {
        id: userDecode.id,
      },
    });
    if (!dataUserById) {
      return res.status(400).send({
        status: "fail",
        message: `User Not Found`,
      });
    }
    // End CheckUserById

    return res.send({
      status: "success",
      message: `Authorization Success`,
      user: {
        email: dataUserById.email,
        username: dataUserById.username,
        fulName: dataUserById.fullname,
        level: dataUserById.level,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(401).send({
      status: "fail",
      message: `Error catch`,
      error: error.message,
    });
  }
};
