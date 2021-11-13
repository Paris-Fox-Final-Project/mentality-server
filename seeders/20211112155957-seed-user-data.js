'use strict';
const fs = require("fs")
const {encodePassword} = require("../helpers/bcrypt")

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
     const readJson = JSON.parse(fs.readFileSync("./data/user.json", "utf-8"))
     readJson.forEach(el => {
       el.password = encodePassword(el.password)
       el.createdAt = new Date()
       el.updatedAt = new Date()
     });
     await queryInterface.bulkInsert('Users', readJson);
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
     await queryInterface.bulkDelete('Users', null, {});
  }
};
