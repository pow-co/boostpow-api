'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('boost_job_proofs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      job_txid: {
        allowNull: false,
        type: Sequelize.STRING
      },
      job_vout: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      spend_txid: {
        allowNull: false,
        type: Sequelize.STRING
      },
      spend_vout: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      signature: {
        allowNull: true,
        type: Sequelize.STRING
      },
      content: {
        allowNull: false,
        type: Sequelize.STRING
      },
      timestamp: {
        allowNull: false,
        type: Sequelize.DATE
      },
      difficulty: {
        allowNull: false,
        type: Sequelize.DECIMAL
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
    await queryInterface.dropTable('boost_job_proofs');
  }
};
