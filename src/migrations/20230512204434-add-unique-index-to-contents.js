'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {

    queryInterface.addConstraint('Contents', {
      fields: ['txid'],
      type: 'unique',
      name: 'unique_contents_txid'
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
