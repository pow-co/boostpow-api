'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('planaria_syncs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      query: {
        type: Sequelize.JSON
      },
      timestamp: {
        type: Sequelize.DATE
      },
      block_index: {
        type: Sequelize.INTEGER
      },
      block_hash: {
        type: Sequelize.STRING
      },
      block_tx_index: {
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
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('planaria_syncs');
  }
};