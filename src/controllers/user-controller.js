const { User: UserModel } = require("../../models");

exports.getUsers = async (req, res) => {
  try {
    const dataUsers = await UserModel.findAll({
      attributes: {
        exclude: ["password", "createdAt", "updatedAt"],
      },
    });

    return res.status(200).send({
      status: "success",
      message: dataUsers.length > 0 ? "Get users success" : "No users found",
      data: dataUsers,
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
