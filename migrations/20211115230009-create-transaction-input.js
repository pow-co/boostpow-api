'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('TransactionInputs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      txid: {
        type: Sequelize.STRING
      },
      input_txid: {
        type: Sequelize.STRING
      },
      input_index: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    await queryInterface.addIndex('TransactionInputs', ['input_txid', 'input_index'])
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('TransactionInputs');
  }
};
