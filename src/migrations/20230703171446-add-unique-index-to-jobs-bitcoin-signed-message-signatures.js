'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addIndex('boost_jobs', ['bitcoin_signed_message_signature'], {
      name: 'valid_unique_signatures_for_boost_jobs',
      unique: true
    })

  },

  async down (queryInterface, Sequelize) {

    await queryInterface.removeIndex('boost_jobs', 'valid_unique_signatures_for_boost_jobs')
  }

};
