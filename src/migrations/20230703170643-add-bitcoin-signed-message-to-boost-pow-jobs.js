'use strict';

module.exports = {

  async up (queryInterface, Sequelize) {

    await queryInterface.addColumn('boost_jobs', 'bitcoin_signed_message_address', {
      type: Sequelize.STRING,
      allowNull: true
    }) 

    await queryInterface.addColumn('boost_jobs', 'bitcoin_signed_message_signature', {
      type: Sequelize.TEXT,
      allowNull: true
    }) 

    await queryInterface.addIndex('boost_jobs', ['bitcoin_signed_message_address'])

    await queryInterface.addIndex('boost_jobs', ['bitcoin_signed_message_address', 'timestamp'])

  },

  async down (queryInterface, Sequelize) {

    await queryInterface.removeIndex('boost_jobs', ['bitcoin_signed_message_address'])

    await queryInterface.removeIndex('boost_jobs', ['bitcoin_signed_message_address', 'timestamp'])

    await queryInterface.removeColumn('boost_jobs', 'bitcoin_signed_message_address')

    await queryInterface.removeColumn('boost_jobs', 'bitcoin_signed_message_signature')

  }

};
