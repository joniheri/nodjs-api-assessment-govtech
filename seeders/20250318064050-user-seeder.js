"use strict";

const { User: UserModel } = require("../models");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");

const dataInput = {
  email: "admin@email.com",
  username: "admin",
  password: "admin",
  fullName: "Administrator",
  status: "active",
  level: 1,
};

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */

    // CheckEmailAlreadyExist
    const dataUserByEmail = await UserModel.findOne({
      where: {
        email: dataInput.email,
      },
    });
    if (dataUserByEmail) {
      return console.log({
        status: `fail`,
        message: `User with email:${dataInput.email} Already Exist`,
      });
    }
    // End CheckEmailAlreadyExist

    // CheckUsernameAlreadyExist
    const dataUserByUsername = await UserModel.findOne({
      where: {
        username: dataInput.username,
      },
    });
    if (dataUserByUsername) {
      return console.log({
        status: `fail`,
        message: `User with username:${dataInput.username} Already Exist`,
      });
    }
    // End CheckUsernameAlreadyExist

    // ProcessInsertData
    const insertData = await UserModel.create({
      id: uuidv4(),
      email: dataInput.email,
      username: dataInput.username,
      password: await bcrypt.hash(dataInput.password, 10),
      fullName: dataInput.fullName,
      status: dataInput.status,
      level: dataInput.level,
    });
    if (!insertData) {
      return console.log({
        status: `fail`,
        message: "Add data user Fail",
      });
    }
    // End ProcessInsertData

    return console.log({
      status: "success",
      message: "Add data user Success",
      data: dataInput,
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
