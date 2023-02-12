'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    await queryInterface.addColumn('boost_jobs', 'minerPubKeyHash', {
      type: Sequelize.STRING,
      allowNull: true
    })

  },

  async down (queryInterface, Sequelize) {

    await queryInterface.removeColumn('boost_jobs', 'minerPubKeyHash')

  }
};
