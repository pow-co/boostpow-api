'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('TransactionInputs', 'block_hash', { type: Sequelize.STRING });
    await queryInterface.addColumn('TransactionInputs', 'block_height', { type: Sequelize.INTEGER });
    await queryInterface.addColumn('Transactions', 'block_height', { type: Sequelize.INTEGER });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('TransactionInputs', 'block_hash');
    await queryInterface.removeColumn('TransactionInputs', 'block_height');
    await queryInterface.removeColumn('Transactions', 'block_height');
  }
};
