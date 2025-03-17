"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Teacher extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Teacher.init(
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // Pastikan email tidak duplikat
        validate: {
          isEmail: true, // Validasi format email
          notNull: { msg: "Email is required" },
        },
      },
      fullName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [3, 255], // Minimal 3 karakter
        },
      },
      gender: {
        type: DataTypes.STRING,
        validate: {
          isIn: [["male", "female", "other"]], // Batasan pilihan gender
        },
      },
    },
    {
      sequelize,
      modelName: "Teacher",
    }
  );
  return Teacher;
};
