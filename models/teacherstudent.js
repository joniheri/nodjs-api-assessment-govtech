"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class TeacherStudent extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.TeacherStudent.belongsTo(models.Teacher, {
        foreignKey: "teacherId",
        as: "teacher",
      });
      models.TeacherStudent.belongsTo(models.Student, {
        foreignKey: "studentId",
        as: "student",
      });
    }
  }
  TeacherStudent.init(
    {
      teacherId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Teachers",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      studentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Students",
          key: "id",
        },
        onDelete: "CASCADE",
      },
    },
    {
      sequelize,
      modelName: "TeacherStudent",
    }
  );
  return TeacherStudent;
};
