const express = require("express");
require("dotenv").config();

const protectedRoutes = require("./routes/protected-routes");
const authRoutes = require("./routes/auth-routes");
const userRoutes = require("./routes/user-routes");
const teacherRoutes = require("./routes/teacher-routes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/api/auth", authRoutes); // Auth Routes
app.use("/api/protected-route", protectedRoutes); // Middleware/Auth Route Private (Butuh Token)
app.use("/api/users", userRoutes); // User Routes
app.use("/api/teachers", teacherRoutes); // Teacher Routes

app.get("/", (req, res) => {
  return res.send({
    status: "success",
    message: `Hello! program is running now`,
  });
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
