'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {

     await queryInterface.addColumn('boost_job_proofs', 'minerPubKey', { type: Sequelize.STRING });
  },

  async down (queryInterface, Sequelize) {

    await queryInterface.removeColumn('boost_job_proofs', 'minerPubKey')

  }
};
