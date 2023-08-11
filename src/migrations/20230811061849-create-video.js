'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Videos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      origin: {
        type: Sequelize.STRING
      },
      location: {
        type: Sequelize.STRING
      },
      sha256_hash: {
        type: Sequelize.STRING
      },
      ipfs_hash: {
        type: Sequelize.STRING
      },
      segments: {
        type: Sequelize.JSON
      },
      owner: {
        type: Sequelize.STRING
      },
      operator: {
        type: Sequelize.STRING
      },
      watch_price: {
        type: Sequelize.INTEGER
      },
      ask_price: {
        type: Sequelize.INTEGER
      },
      bid_price: {
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
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Videos');
  }
};