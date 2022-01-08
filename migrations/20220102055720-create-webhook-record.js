'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('WebhookRecords', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      started_at: {
        type: Sequelize.DATE
      },
      ended_at: {
        type: Sequelize.DATE
      },
      job_txid: {
        type: Sequelize.STRING
      },
      type: {
        type: Sequelize.STRING
      },
      response_code: {
        type: Sequelize.INTEGER
      },
      response_body: {
        type: Sequelize.TEXT
      },
      error: {
        type: Sequelize.TEXT
      },
      url: {
        type: Sequelize.TEXT
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
    await queryInterface.dropTable('WebhookRecords');
  }
};