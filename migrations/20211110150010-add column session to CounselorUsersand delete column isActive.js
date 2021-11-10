"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.removeColumn("CounselorUsers", "isActive");
    await queryInterface.addColumn(
      "CounselorUsers",
      "totalSession",
      Sequelize.INTEGER
    );
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.addColumn(
      "CounselorUsers",
      "isActive",
      Sequelize.BOOLEAN
    );
    await queryInterface.removeColumn("CounselorUsers", "totalSession");
  },
};
