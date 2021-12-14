'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('BTransactions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      txid: {
        type: Sequelize.STRING
      },
      contentType: {
        type: Sequelize.STRING
      },
      encoding: {
        type: Sequelize.STRING
      },
      fileName: {
        type: Sequelize.STRING
      },
      content: {
        type: Sequelize.TEXT
      },
      txo: {
        type: Sequelize.JSON
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
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('BTransactions');
  }
};
