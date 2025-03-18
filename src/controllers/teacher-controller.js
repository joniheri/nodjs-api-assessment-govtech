const {
  Teacher: TeacherModel,
  Student: StudentModel,
  TeacherStudent: TeacherStudentModel,
  sequelize,
} = require("../../models");
const joi = require("joi");

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

    return res.status(200).send({
      status: "success",
      message: "Get Teachers successfully",
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

exports.registerStudents = async (req, res) => {
  // Membuat transaksi database untuk memastikan semua perubahan dilakukan dengan aman.
  // Jika ada error, semua perubahan bisa dibatalkan (rollback).
  const transaction = await sequelize.transaction();

  try {
    // Validasi Input Menggunakan Joi
    const schema = joi.object({
      teacher: joi.string().email().required(),
      students: joi.array().items(joi.string().email()).required(),
    });

    const { error, value } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        status: "fail",
        message: error.details[0].message,
      });
    }

    const { teacher, students } = value;

    // **Gunakan findOrCreate agar lebih aman dari race condition**
    const [teacherRecord] = await TeacherModel.findOrCreate({
      where: { email: teacher },
      defaults: { email: teacher },
      transaction,
    });

    // **Ambil semua student yang sudah ada dalam satu query**
    const existingStudents = await StudentModel.findAll({
      where: { email: students },
      transaction,
    });

    // Buat daftar email student yang sudah ada
    const existingStudentEmails = existingStudents.map((s) => s.email);

    // Cari student yang belum ada di database
    const newStudentEmails = students.filter(
      (email) => !existingStudentEmails.includes(email)
    );

    // Jika ada student baru, buat sekaligus dengan bulkCreate
    if (newStudentEmails.length > 0) {
      const newStudents = await StudentModel.bulkCreate(
        newStudentEmails.map((email) => ({ email })),
        { transaction, ignoreDuplicates: true, returning: true }
      );

      // Gabungkan student yang baru dibuat dengan yang sudah ada
      existingStudents.push(...newStudents);
    }

    // **Cek apakah relasi Teacher-Student sudah ada sebelum menambahkan**
    const existingRelations = await TeacherStudentModel.findAll({
      where: {
        teacherId: teacherRecord.id,
        studentId: existingStudents.map((s) => s.id),
      },
      transaction,
    });

    const existingRelationIds = existingRelations.map((rel) => rel.studentId);

    // Filter hanya student yang belum terdaftar dengan teacher ini
    const relationsToInsert = existingStudents
      .filter((student) => !existingRelationIds.includes(student.id))
      .map((student) => ({
        teacherId: teacherRecord.id,
        studentId: student.id,
      }));

    // Gunakan `bulkCreate` agar lebih optimal
    if (relationsToInsert.length > 0) {
      await TeacherStudentModel.bulkCreate(relationsToInsert, {
        transaction,
        ignoreDuplicates: true, // Mencegah error jika ada duplikasi
      });
    }

    await transaction.commit(); // Commit jika semua proses berhasil

    // return res.status(201).json({
    //   status: "success",
    //   message: "Teacher registered students successfully",
    // });

    return res.status(204).json();
  } catch (error) {
    await transaction.rollback(); // Rollback jika ada error
    console.error(error.message);
    return res.status(500).json({
      status: "fail",
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

exports.getCommonStudents = async (req, res) => {
  try {
    let teachers = req.query.teacher; // Ambil query parameter teacher

    // Pastikan teacher adalah array (jika hanya satu, ubah jadi array)
    if (!teachers) {
      return res.status(400).json({
        status: "fail",
        message: "Teacher query parameter is required",
      });
    }
    if (!Array.isArray(teachers)) {
      teachers = [teachers]; // Ubah jadi array jika hanya satu
    }

    // Cari semua teacher berdasarkan email
    const teacherRecords = await TeacherModel.findAll({
      where: { email: teachers },
      attributes: ["id"], // Kita hanya butuh ID
    });

    // Jika tidak ada guru yang ditemukan, kembalikan response kosong
    if (teacherRecords.length === 0) {
      return res.status(200).json({ students: [] });
    }

    // Ambil semua ID guru
    const teacherIds = teacherRecords.map((teacher) => teacher.id);

    // Ambil semua relasi student yang diajar oleh teacher yang diminta
    const teacherStudentRecords = await TeacherStudentModel.findAll({
      where: { teacherId: teacherIds },
      attributes: ["studentId"], // Kita hanya butuh ID murid
    });

    // Jika tidak ada student yang ditemukan, return kosong
    if (teacherStudentRecords.length === 0) {
      return res.status(200).json({ students: [] });
    }

    // Hitung jumlah guru per studentId (untuk filtering jika banyak guru)
    const studentCountMap = {};
    teacherStudentRecords.forEach((record) => {
      studentCountMap[record.studentId] =
        (studentCountMap[record.studentId] || 0) + 1;
    });

    // Ambil hanya studentId yang muncul sebanyak jumlah teacher (artinya diajar oleh semua guru)
    const commonStudentIds = Object.keys(studentCountMap).filter(
      (studentId) => studentCountMap[studentId] === teacherIds.length
    );

    // Ambil email dari student yang ditemukan
    const commonStudents = await StudentModel.findAll({
      where: { id: commonStudentIds },
      attributes: ["email"], // Kita hanya butuh email
    });

    // Kirim response
    return res.status(200).json({
      students: commonStudents.map((student) => student.email),
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      status: "fail",
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

exports.suspendStudent = async (req, res) => {
  try {
    // Validasi request body
    const schema = joi.object({
      student: joi.string().email().required(),
    });

    const { error, value } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        status: "fail",
        message: error.details[0].message,
      });
    }

    const { student } = value;

    // Cari student berdasarkan email
    const studentRecord = await StudentModel.findOne({
      where: { email: student },
    });

    if (!studentRecord) {
      return res.status(404).json({
        status: "fail",
        message: "Student not found",
      });
    }

    // Update status suspended
    await studentRecord.update({ suspended: true });

    return res.status(204).send(); // Berhasil, tanpa response body
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "fail",
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

exports.unSuspendStudent = async (req, res) => {
  try {
    // Validasi request body
    const schema = joi.object({
      student: joi.string().email().required(),
    });

    const { error, value } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        status: "fail",
        message: error.details[0].message,
      });
    }

    const { student } = value;

    // Cari student berdasarkan email
    const studentRecord = await StudentModel.findOne({
      where: { email: student },
    });

    if (!studentRecord) {
      return res.status(404).json({
        status: "fail",
        message: "Student not found",
      });
    }

    // Jika student tidak dalam kondisi suspended, return 400
    if (!studentRecord.suspended) {
      return res.status(400).json({
        status: "fail",
        message: "Student is not suspended",
      });
    }

    // Update status suspended ke false
    await studentRecord.update({ suspended: false });

    return res.status(204).send(); // Berhasil, tanpa response body
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "fail",
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

exports.retrieveForNotifications = async (req, res) => {
  try {
    // Validasi request body menggunakan Joi
    const schema = joi.object({
      teacher: joi.string().email().required(),
      notification: joi.string().required(),
    });

    const { error, value } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        status: "fail",
        message: error.details[0].message,
      });
    }

    const { teacher, notification } = value;

    // Cek apakah guru ada di database
    const teacherRecord = await TeacherModel.findOne({
      where: { email: teacher },
    });

    if (!teacherRecord) {
      return res.status(404).json({
        status: "fail",
        message: "Teacher not found",
      });
    }

    // Ambil daftar siswa yang terdaftar pada guru ini dan tidak disuspend
    const registeredStudents = await StudentModel.findAll({
      include: {
        model: TeacherModel,
        as: "teachers",
        where: { id: teacherRecord.id },
      },
      where: { suspended: false },
    });

    // Ambil daftar email siswa yang terdaftar pada guru
    const registeredEmails = registeredStudents.map((s) => s.email);

    // Cari email yang disebutkan dalam notifikasi dengan regex
    const mentionedEmails = (
      notification.match(/@([\w.-]+@[a-zA-Z.-]+)/g) || []
    ).map((email) => email.substring(1)); // Hilangkan karakter '@'

    // Ambil daftar siswa dari mention yang ada dalam database dan tidak suspended
    const mentionedStudents = await StudentModel.findAll({
      where: {
        email: mentionedEmails,
        suspended: false,
      },
    });

    const mentionedEmailsFiltered = mentionedStudents.map((s) => s.email);

    // Cek apakah ada email yang disebut tetapi tidak ditemukan di database
    const notFoundEmails = mentionedEmails.filter(
      (email) => !mentionedEmailsFiltered.includes(email)
    );

    if (notFoundEmails.length > 0) {
      return res.status(404).json({
        status: "fail",
        message: `Student with email ${notFoundEmails.join(", ")} not found`,
      });
    }

    // Gabungkan daftar email registered students dan mentioned students
    const recipients = [
      ...new Set([...registeredEmails, ...mentionedEmailsFiltered]),
    ];

    return res.status(200).json({ recipients });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "fail",
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
