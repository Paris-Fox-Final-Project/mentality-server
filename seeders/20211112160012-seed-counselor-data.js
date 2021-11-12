'use strict';
const fs = require("fs")
// const readJson = JSON.parse(fs.readFileSync("../data/counselor.json", "utf-8"))
// console.log(readJson)
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
     const readJson = JSON.parse(fs.readFileSync("./data/counselor.json", "utf-8"))
     readJson.forEach(el => {
       el.createdAt = new Date()
       el.updatedAt = new Date()
     });
     await queryInterface.bulkInsert('Counselors', readJson);
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
     await queryInterface.bulkDelete('Counselors', null, {});
  }
};
