'use strict';

module.exports = {

  up: async (queryInterface, Sequelize) => {

    await queryInterface.addColumn('boost_jobs', 'tx_hex', Sequelize.TEXT)

    await queryInterface.addColumn('boost_job_proofs', 'tx_hex', Sequelize.TEXT)

  },

  down: async (queryInterface, Sequelize) => {

    await queryInterface.removeColumn('boost_jobs', 'tx_hex')

    await queryInterface.removeColumn('boost_job_proofs', 'tx_hex')

  }

};
