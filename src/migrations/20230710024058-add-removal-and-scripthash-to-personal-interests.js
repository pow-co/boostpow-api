'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('PersonalInterests', 'removal_location', { type: Sequelize.STRING })
    await queryInterface.addColumn('PersonalInterests', 'script_hash', { type: Sequelize.STRING })
    await queryInterface.addColumn('PersonalInterests', 'script', { type: Sequelize.TEXT })
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('PersonalInterests', 'removal_location')
    await queryInterface.removeColumn('PersonalInterests', 'script_hash')
    await queryInterface.removeColumn('PersonalInterests', 'script')
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
