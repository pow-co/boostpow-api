'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('boost_jobs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      content: {
        type: Sequelize.STRING,
        allowNull: false
      },
      difficulty: {
        type: Sequelize.DECIMAL,
        allowNull: false
      },
      category: {
        type: Sequelize.STRING,
        allowNull: true
      },
      tag: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      additionalData: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      userNonce: {
        type: Sequelize.STRING,
        allowNull: true
      },
      txid: {
        type: Sequelize.STRING,
        allowNull: false
      },
      vout: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      value: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      timestamp: {
        type: Sequelize.DATE,
        allowNull: false
      },
      spent: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false
      },
      spent_txid: {
        type: Sequelize.STRING,
        allowNull: true
      },
      spent_vout: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      script: {
        type: Sequelize.TEXT,
        allowNull: false
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
    await queryInterface.dropTable('boost_jobs');
  }
};
