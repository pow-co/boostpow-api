'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
      queryInterface.addIndex(
        'BTransactions',
        ['txid'],
        {
          indicesType: 'UNIQUE',
        }
      );
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
