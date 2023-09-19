'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Contents', 'author_paymail', { type: Sequelize.STRING, allowNull: true });
    await queryInterface.addColumn('Contents', 'author_pubkey', { type: Sequelize.STRING, allowNull: true });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Contents', 'author_paymail');
    await queryInterface.removeColumn('Contents', 'author_pubkey');
  }
};
