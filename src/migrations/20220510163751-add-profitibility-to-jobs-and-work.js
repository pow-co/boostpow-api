'use strict';

module.exports = {

  up: async (queryInterface, Sequelize) => {
     await queryInterface.addColumn('boost_jobs', 'profitability', {
       type: Sequelize.DECIMAL,
       allowNull: true
     });

     await queryInterface.addColumn('boost_job_proofs', 'profitability', {
       type: Sequelize.DECIMAL,
       allowNull: true
     });
  },

  down: async (queryInterface, Sequelize) => {

     await queryInterface.removeColumn('boost_job_proofs', 'profitability')

     await queryInterface.removeColumn('boost_jobs', 'profitability')

  }
};
