const {
  Teacher: TeacherModel,
  Student: StudentModel,
  TeacherStudent: TeacherStudentModel,
  sequelize,
} = require("../../models");
const joi = require("joi");

exports.getTeachers = async (req, res) => {
  try {
    const TeacherModel = req.models?.Teacher || require("../../models").Teacher;

    //Get all teachers data from database
    const teachers = await TeacherModel.findAll({
      attributes: {
        exclude: ["password", "createdAt", "updatedAt"],
      },
      order: [["createdAt", "DESC"]],
    });

    // If no data teachers in database
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
  // Creating a database transaction to ensure all changes are made safely.
  // If an error occurs, all changes can be rolled back.
  const transaction = await sequelize.transaction();

  try {
    // Validasi Input Using Joi
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

    // **Use findOrCreate to be safer from race conditions.**
    const [teacherRecord] = await TeacherModel.findOrCreate({
      where: { email: teacher },
      defaults: { email: teacher },
      transaction,
    });

    // **Retrieve all existing students in a single query.**
    const existingStudents = await StudentModel.findAll({
      where: { email: students },
      transaction,
    });

    // Create a list of existing student emails.
    const existingStudentEmails = existingStudents.map((s) => s.email);

    // Find students who are not yet in the database.
    const newStudentEmails = students.filter(
      (email) => !existingStudentEmails.includes(email)
    );

    // If there are new students, create them at once using bulkCreate.
    if (newStudentEmails.length > 0) {
      const newStudents = await StudentModel.bulkCreate(
        newStudentEmails.map((email) => ({ email })),
        { transaction, ignoreDuplicates: true, returning: true }
      );

      // Merge the newly created students with the existing ones.
      existingStudents.push(...newStudents);
    }

    // **Check if the Teacher-Student relationship already exists before adding.**
    const existingRelations = await TeacherStudentModel.findAll({
      where: {
        teacherId: teacherRecord.id,
        studentId: existingStudents.map((s) => s.id),
      },
      transaction,
    });

    const existingRelationIds = existingRelations.map((rel) => rel.studentId);

    // Filter only students who are not yet registered with this teacher.
    const relationsToInsert = existingStudents
      .filter((student) => !existingRelationIds.includes(student.id))
      .map((student) => ({
        teacherId: teacherRecord.id,
        studentId: student.id,
      }));

    // Use bulkCreate for better optimization.
    if (relationsToInsert.length > 0) {
      await TeacherStudentModel.bulkCreate(relationsToInsert, {
        transaction,
        ignoreDuplicates: true, // Prevent errors if there are duplicates
      });
    }

    await transaction.commit(); // Commit if all process success

    return res.status(204).json();
  } catch (error) {
    await transaction.rollback(); // Rollback if an error
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
    let teachers = req.query.teacher; // Take query teacher parameter

    // Ensure teacher is array (if just one, chate to array)
    if (!teachers) {
      return res.status(400).json({
        status: "fail",
        message: "Teacher query parameter is required",
      });
    }
    if (!Array.isArray(teachers)) {
      teachers = [teachers]; // Chage to array if just one
    }

    // Search all teacher by email
    const teacherRecords = await TeacherModel.findAll({
      where: { email: teachers },
      attributes: ["id"], // We just need ID
    });

    // If not teacher found, return empty response
    if (teacherRecords.length === 0) {
      return res.status(200).json({ students: [] });
    }

    // Take all Teacher ID
    const teacherIds = teacherRecords.map((teacher) => teacher.id);

    // Retrieve all student relationships taught by the requested teacher.
    const teacherStudentRecords = await TeacherStudentModel.findAll({
      where: { teacherId: teacherIds },
      attributes: ["studentId"], // Kita hanya butuh ID murid
    });

    // If student not found, return an empty response
    if (teacherStudentRecords.length === 0) {
      return res.status(200).json({ students: [] });
    }

    // Count the number of teachers per studentId (for filtering if there are multiple teachers)
    const studentCountMap = {};
    teacherStudentRecords.forEach((record) => {
      studentCountMap[record.studentId] =
        (studentCountMap[record.studentId] || 0) + 1;
    });

    // Retrieve only the student IDs that appear as many times as the number of teachers (meaning they are taught by all the teachers).
    const commonStudentIds = Object.keys(studentCountMap).filter(
      (studentId) => studentCountMap[studentId] === teacherIds.length
    );

    // Retrieve email from student found
    const commonStudents = await StudentModel.findAll({
      where: { id: commonStudentIds },
      attributes: ["email"], // Kita hanya butuh email
    });

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

    // Search student by email
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

    return res.status(204).send(); // Suucess, without response body
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

    // Search student by email
    const studentRecord = await StudentModel.findOne({
      where: { email: student },
    });

    if (!studentRecord) {
      return res.status(404).json({
        status: "fail",
        message: "Student not found",
      });
    }

    // If the student is not suspended, return a 400 status code.
    if (!studentRecord.suspended) {
      return res.status(400).json({
        status: "fail",
        message: "Student is not suspended",
      });
    }

    // Update status suspended to false
    await studentRecord.update({ suspended: false });

    return res.status(204).send(); // Succes, without response body
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
    // Validasi request body
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

    // Check if the teacher exists in the database.
    const teacherRecord = await TeacherModel.findOne({
      where: { email: teacher },
    });

    if (!teacherRecord) {
      return res.status(404).json({
        status: "fail",
        message: "Teacher not found",
      });
    }

    // Retrieve the list of students registered under this teacher and not suspended.
    const registeredStudents = await StudentModel.findAll({
      include: {
        model: TeacherModel,
        as: "teachers",
        where: { id: teacherRecord.id },
      },
      where: { suspended: false },
    });

    // Retrieve the list of student emails registered under the teacher.
    const registeredEmails = registeredStudents.map((s) => s.email);

    // Find the emails mentioned in the notification using regex.
    const mentionedEmails = (
      notification.match(/@([\w.-]+@[a-zA-Z.-]+)/g) || []
    ).map((email) => email.substring(1)); // Hilangkan karakter '@'

    // Retrieve the list of students from the mentions that exist in the database and are not suspended.
    const mentionedStudents = await StudentModel.findAll({
      where: {
        email: mentionedEmails,
        suspended: false,
      },
    });

    const mentionedEmailsFiltered = mentionedStudents.map((s) => s.email);

    // Retrieve the list of students from the mentions that exist in the database and are not suspended.
    const notFoundEmails = mentionedEmails.filter(
      (email) => !mentionedEmailsFiltered.includes(email)
    );

    if (notFoundEmails.length > 0) {
      return res.status(404).json({
        status: "fail",
        message: `Student with email ${notFoundEmails.join(", ")} not found`,
      });
    }

    // Merge the list of registered students' emails and mentioned students' emails.
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
