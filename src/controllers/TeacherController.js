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
