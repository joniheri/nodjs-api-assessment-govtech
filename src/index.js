const express = require("express");
require("dotenv").config();
const app = express();
const PORT = process.env.PORT || 3000;

const routes = require("./routes/routes");

app.use(express.json());

app.use("/api", routes); // UseRoutes

app.get("/", (req, res) => {
  return res.send({
    status: "success",
    message: `Hello! program is running now`,
  });
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
