'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
     await queryInterface.addColumn('boost_jobs', 'miner', { type: Sequelize.STRING });
     await queryInterface.addColumn('boost_job_proofs', 'miner', { type: Sequelize.STRING });
  },

  async down (queryInterface, Sequelize) {
     await queryInterface.removeColumn('boost_jobs', 'miner');
     await queryInterface.removeColumn('boost_job_proofs', 'miner');
  }
};
