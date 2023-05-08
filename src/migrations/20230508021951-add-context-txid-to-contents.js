'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Contents', 'context_txid', { type: Sequelize.STRING })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Contents', 'context_txid')
  }
};
