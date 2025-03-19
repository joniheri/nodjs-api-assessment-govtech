const { Sequelize } = require("sequelize");
const config = require("../../config/config.json")["test"];

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: config.dialect,
  }
);

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Koneksi to database test succesfully!");
  } catch (error) {
    console.error("Koneksi fail:", error);
  } finally {
    await sequelize.close();
  }
})();
