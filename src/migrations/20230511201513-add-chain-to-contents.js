'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {

    await queryInterface.addColumn('Contents', 'chain', { type: Sequelize.STRING })

  },

  async down (queryInterface, Sequelize) {

    await queryInterface.removeColumn('Contents', 'chain')
  }
};
