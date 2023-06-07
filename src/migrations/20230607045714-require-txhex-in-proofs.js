'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
	  await queryInterface.changeColumn('boost_job_proofs', 'tx_hex', {
		  type: Sequelize.TEXT,
		  allowNull: false
	  })
  },

  async down (queryInterface, Sequelize) {
	  await queryInterface.changeColumn('boost_job_proofs', 'tx_hex', {
		  type: Sequelize.TEXT,
		  allowNull: true
	  })
  }
};
