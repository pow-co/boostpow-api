'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    await queryInterface.removeIndex('boost_jobs', 'boost_jobs_txid_index')
    await queryInterface.addIndex('boost_jobs', ['txid', 'vout'], {
      indexName: 'boost_jobs_txid_vout_index',
      indicesType: 'UNIQUE'
    })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */

    await queryInterface.removeIndex('boost_jobs', 'boost_jobs_txid_vout_index')
  }
};
