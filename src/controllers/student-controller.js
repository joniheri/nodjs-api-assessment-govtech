const { where } = require("sequelize");
const { Student: StudentModel } = require("../../models");
const joi = require("joi");

exports.createStudent = async (req, res) => {
  try {
    const dataInput = req.body;

    // Validasi input dengan Joi
    const validationSchema = joi.object({
      email: joi.string().email().trim().required(),
      fullName: joi.string().min(3).trim().optional(),
      gender: joi.string().valid("male", "female", "other").optional(),
    });

    const { error } = validationSchema.validate(dataInput);
    if (error) {
      return res.status(400).send({
        status: "fail",
        message: error.details[0].message,
      });
    }

    // Cek apakah email sudah terdaftar
    const existingStudent = await StudentModel.findOne({
      where: { email: dataInput.email },
    });
    if (existingStudent) {
      return res.status(400).send({
        status: "fail",
        message: "Email already exists",
      });
    }

    // Simpan data ke database
    const newStudent = await StudentModel.create(dataInput);

    return res.status(201).send({
      status: "success",
      message: "Student created successfully",
      data: newStudent,
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

exports.getStudents = async (req, res) => {
  try {
    // Ambil semua data dari database
    const students = await StudentModel.findAll({
      attributes: {
        exclude: ["password", "createdAt", "updatedAt"],
      },
      order: [["createdAt", "DESC"]],
    });

    // Jika tidak ada data
    if (students.length === 0) {
      return res.status(404).send({
        status: "fail",
        message: "No students found",
      });
    }

    // Kirim response dengan data
    return res.status(200).send({
      status: "success",
      message: "Students retrieved successfully",
      data: students,
    });
  } catch (error) {
    console.error("Error fetching Students:", error.message);
    return res.status(500).send({
      status: "fail",
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.getStudent = async (req, res) => {
  try {
    const { id } = req.params;

    // Ambil semua data dari database
    const student = await StudentModel.findOne(
      {
        where: {
          id: id,
        },
      },
      {
        attributes: {
          exclude: ["password", "createdAt", "updatedAt"],
        },
      }
    );

    // Jika tidak ada data
    if (!student) {
      return res.status(404).send({
        status: "fail",
        message: `Data with id: ${id} found`,
      });
    }

    // Kirim response dengan data
    return res.status(200).send({
      status: "success",
      message: "Get student successfully",
      data: student,
    });
  } catch (error) {
    console.error("Error fetching Students:", error.message);
    return res.status(500).send({
      status: "fail",
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const dataInput = req.body;

    // Validasi input dengan Joi
    const validationSchema = joi.object({
      email: joi.string().email().trim().required(),
      fullName: joi.string().min(3).trim().optional(),
      gender: joi.string().valid("male", "female", "other").optional(),
      suspended: joi.boolean().optional(),
    });

    const { error } = validationSchema.validate(dataInput);
    if (error) {
      return res.status(400).send({
        status: "fail",
        message: error.details[0].message,
      });
    }

    // Cek data dengan by ID
    const student = await StudentModel.findByPk(id);
    if (!student) {
      return res.status(404).send({
        status: "fail",
        message: `Student with ID ${id} not found`,
      });
    }

    // Cek apakah email dirubah atau tidak
    if (dataInput.email && dataInput.email !== student.email) {
      // Periksa apakah email baru sudah digunakan
      const emailExists = await StudentModel.findOne({
        where: { email: dataInput.email },
      });

      if (emailExists) {
        return res.status(400).send({
          status: "fail",
          message: "Email is already in use",
        });
      }
    }

    // Update data
    await student.update(dataInput);

    return res.status(200).send({
      status: "success",
      message: "Student updated successfully",
      student,
    });
  } catch (error) {
    console.error("Error updating Student:", error.message);
    return res.status(500).send({
      status: "fail",
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    // Cek apakah data dengan ID tersebut ada
    const student = await StudentModel.findByPk(id);
    if (!student) {
      return res.status(404).send({
        status: "fail",
        message: `Student with ID ${id} not found`,
      });
    }

    // Hapus data dari database
    await student.destroy();

    return res.status(200).send({
      status: "success",
      message: "Student deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting student:", error.message);
    return res.status(500).send({
      status: "fail",
      message: "Internal server error",
      error: error.message,
    });
  }
};
