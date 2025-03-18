"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Student extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Student.belongsToMany(models.Teacher, {
        through: models.TeacherStudent,
        foreignKey: "studentId",
        onDelete: "CASCADE",
        as: "teachers",
      });
    }
  }
  Student.init(
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
          notNull: { msg: "Email is required" },
          len: [5, 255],
        },
      },
      fullName: {
        type: DataTypes.STRING,
        allowNull: true,
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
      suspended: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "Student",
    }
  );
  return Student;
};
