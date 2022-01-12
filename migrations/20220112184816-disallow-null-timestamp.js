'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('boost_job_proofs', 'timestamp', { 
      type: Sequelize.DATE,
      allowNull: false
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('boost_job_proofs', 'timestamp', {
      type: Sequelize.DATE,
      allowNull: true
    });
  }
};
