const request = require("supertest");
const app = require("../src/index");
const { sequelize, Teacher, Student, TeacherStudent } = require("../models");

describe("Teacher Controller API", () => {
  beforeAll(async () => {
    // Bersihkan database sebelum test berjalan
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    // Tutup koneksi database setelah semua tes selesai
    await sequelize.close();
  });

  describe("GET /api/teachers", () => {
    it("should return a list of teachers when data exists", async () => {
      await Teacher.create({ email: "teacher1@example.com" });

      const response = await request(app).get("/api/teachers");

      expect(response.status).toBe(200);
      expect(response.body.status).toBe("success");
      expect(response.body.data.length).toBeGreaterThan(0);
    });

    it("should return 404 when no teachers found", async () => {
      await Teacher.destroy({ where: {} });

      const response = await request(app).get("/api/teachers");

      expect(response.status).toBe(404);
      expect(response.body.status).toBe("fail");
      expect(response.body.message).toBe("No teachers found");
    });

    it("should return 500 when an error occurs", async () => {
      jest
        .spyOn(Teacher, "findAll")
        .mockRejectedValue(new Error("Database Error"));

      const response = await request(app).get("/api/teachers");

      expect(response.status).toBe(500);
      expect(response.body.status).toBe("fail");
      expect(response.body.message).toBe("Internal server error");

      Teacher.findAll.mockRestore();
    });
  });

  describe("POST /api/teachers/register", () => {
    it("should register students under a teacher", async () => {
      const response = await request(app)
        .post("/api/teachers/register")
        .send({
          teacher: "teacher1@example.com",
          students: ["student1@example.com", "student2@example.com"],
        });

      expect(response.status).toBe(204);
    });

    it("should return 400 for invalid input", async () => {
      const response = await request(app)
        .post("/api/teachers/register")
        .send({ teacher: "invalid-email", students: ["student@example.com"] });

      expect(response.status).toBe(400);
      expect(response.body.status).toBe("fail");
    });

    it("should return 500 when an error occurs", async () => {
      jest
        .spyOn(Teacher, "findOrCreate")
        .mockRejectedValue(new Error("Database Error"));

      const response = await request(app)
        .post("/api/teachers/register")
        .send({
          teacher: "teacher1@example.com",
          students: ["student1@example.com"],
        });

      expect(response.status).toBe(500);
      expect(response.body.status).toBe("fail");

      Teacher.findOrCreate.mockRestore();
    });
  });

  describe("GET /api/teachers/commonstudents", () => {
    it("should return common students for multiple teachers", async () => {
      const teacher1 = await Teacher.create({ email: "teacher1@example.com" });
      const teacher2 = await Teacher.create({ email: "teacher2@example.com" });
      const student = await Student.create({ email: "student@example.com" });

      await TeacherStudent.create({
        teacherId: teacher1.id,
        studentId: student.id,
      });
      await TeacherStudent.create({
        teacherId: teacher2.id,
        studentId: student.id,
      });

      const response = await request(app).get(
        "/api/teachers/commonstudents?teacher=teacher1@example.com&teacher=teacher2@example.com"
      );

      expect(response.status).toBe(200);
      expect(response.body.students).toContain("student@example.com");
    });

    it("should return 400 if no teacher query parameter is provided", async () => {
      const response = await request(app).get("/api/teachers/commonstudents");

      expect(response.status).toBe(400);
      expect(response.body.status).toBe("fail");
    });

    it("should return an empty array if no common students exist", async () => {
      const response = await request(app).get(
        "/api/teachers/commonstudents?teacher=teacher1@example.com"
      );

      expect(response.status).toBe(200);
      expect(response.body.students).toEqual([]);
    });
  });

  describe("POST /api/teachers/suspend", () => {
    it("should suspend a student", async () => {
      const student = await Student.create({
        email: "student@example.com",
        suspended: false,
      });

      const response = await request(app)
        .post("/api/teachers/suspend")
        .send({ student: "student@example.com" });

      expect(response.status).toBe(204);

      const updatedStudent = await Student.findOne({
        where: { email: "student@example.com" },
      });
      expect(updatedStudent.suspended).toBe(true);
    });

    it("should return 404 if student is not found", async () => {
      const response = await request(app)
        .post("/api/teachers/suspend")
        .send({ student: "notfound@example.com" });

      expect(response.status).toBe(404);
      expect(response.body.status).toBe("fail");
    });

    it("should return 500 on error", async () => {
      jest
        .spyOn(Student, "findOne")
        .mockRejectedValue(new Error("Database Error"));

      const response = await request(app)
        .post("/api/teachers/suspend")
        .send({ student: "student@example.com" });

      expect(response.status).toBe(500);
      expect(response.body.status).toBe("fail");

      Student.findOne.mockRestore();
    });
  });

  describe("POST /api/teachers/retrievefornotifications", () => {
    it("should return recipients of a notification", async () => {
      const teacher = await Teacher.create({ email: "teacher1@example.com" });
      const student1 = await Student.create({ email: "student1@example.com" });
      const student2 = await Student.create({ email: "student2@example.com" });

      await TeacherStudent.create({
        teacherId: teacher.id,
        studentId: student1.id,
      });
      await TeacherStudent.create({
        teacherId: teacher.id,
        studentId: student2.id,
      });

      const response = await request(app)
        .post("/api/teachers/retrievefornotifications")
        .send({
          teacher: "teacher1@example.com",
          notification: "Hello students @student3@example.com",
        });

      expect(response.status).toBe(200);
      expect(response.body.recipients).toEqual(
        expect.arrayContaining(["student1@example.com", "student2@example.com"])
      );
    });

    it("should return 404 if teacher is not found", async () => {
      const response = await request(app)
        .post("/api/teachers/retrievefornotifications")
        .send({
          teacher: "notfound@example.com",
          notification: "Hello @student@example.com",
        });

      expect(response.status).toBe(404);
    });

    it("should return 400 if input is invalid", async () => {
      const response = await request(app)
        .post("/api/teachers/retrievefornotifications")
        .send({ teacher: "invalid-email" });

      expect(response.status).toBe(400);
    });
  });
});
