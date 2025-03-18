const { Teacher: TeacherModel } = require("../../models");
const joi = require("joi");

exports.createTeacher = async (req, res) => {
  try {
    const dataInput = req.body;

    // Validasi input dengan Joi
    const validationSchema = joi.object({
      fullName: joi.string().min(3).trim().required(),
      email: joi.string().email().trim().required(),
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
    const existingTeacher = await TeacherModel.findOne({
      where: { email: dataInput.email },
    });
    if (existingTeacher) {
      return res.status(400).send({
        status: "fail",
        message: "Email already exists",
      });
    }

    // Simpan data ke database
    const newTeacher = await TeacherModel.create(dataInput);

    return res.status(201).send({
      status: "success",
      message: "Teacher created successfully",
      teacher: newTeacher,
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

exports.getTeachers = async (req, res) => {
  try {
    // Ambil semua data guru dari database
    const teachers = await TeacherModel.findAll({
      attributes: {
        exclude: ["password", "createdAt", "updatedAt"],
      },
      order: [["createdAt", "DESC"]],
    });

    // Jika tidak ada data guru
    if (teachers.length === 0) {
      return res.status(404).send({
        status: "fail",
        message: "No teachers found",
      });
    }

    // Kirim response dengan data guru
    return res.status(200).send({
      status: "success",
      message: "Teachers retrieved successfully",
      data: teachers,
    });
  } catch (error) {
    console.error("Error fetching teachers:", error.message);
    return res.status(500).send({
      status: "fail",
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.updateTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    const dataInput = req.body;

    // Validasi input dengan Joi
    const validationSchema = joi.object({
      fullName: joi.string().min(3).trim().required(),
      email: joi.string().email().trim().required(),
      gender: joi.string().valid("male", "female", "other").optional(),
    });

    const { error } = validationSchema.validate(dataInput);
    if (error) {
      return res.status(400).send({
        status: "fail",
        message: error.details[0].message,
      });
    }

    // Cek apakah teacher dengan ID tersebut ada
    const teacher = await TeacherModel.findByPk(id);
    if (!teacher) {
      return res.status(404).send({
        status: "fail",
        message: `Teacher with ID ${id} not found`,
      });
    }

    // Cek apakah email berubah
    if (dataInput.email && dataInput.email !== teacher.email) {
      // Periksa apakah email baru sudah digunakan oleh teacher lain
      const emailExists = await TeacherModel.findOne({
        where: { email: dataInput.email },
      });

      if (emailExists) {
        return res.status(400).send({
          status: "fail",
          message: "Email is already in use by another teacher",
        });
      }
    }

    // Update data teacher
    await teacher.update(dataInput);

    return res.status(200).send({
      status: "success",
      message: "Teacher updated successfully",
      teacher,
    });
  } catch (error) {
    console.error("Error updating teacher:", error.message);
    return res.status(500).send({
      status: "fail",
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.deleteTeacher = async (req, res) => {
  try {
    const { id } = req.params;

    // Cek apakah teacher dengan ID tersebut ada
    const teacher = await TeacherModel.findByPk(id);
    if (!teacher) {
      return res.status(404).send({
        status: "fail",
        message: `Teacher with ID ${id} not found`,
      });
    }

    // Hapus teacher dari database
    await teacher.destroy();

    return res.status(200).send({
      status: "success",
      message: "Teacher deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting teacher:", error.message);
    return res.status(500).send({
      status: "fail",
      message: "Internal server error",
      error: error.message,
    });
  }
};
