'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Contents', 'map', { type: Sequelize.JSON });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Contents', 'map');
  }
};
