'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Contents', 'bmap', { type: Sequelize.JSON });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Contents', 'bmap');
  }
};
