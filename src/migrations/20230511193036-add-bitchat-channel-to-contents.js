'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {

    await queryInterface.addColumn('Contents', 'bitchat_channel', { type: Sequelize.STRING });

    await queryInterface.addIndex('Contents', {
      fields: ['bitchat_channel']
    }, {
      indexName: 'content_bitchat_channels'
    })

  },

  async down (queryInterface, Sequelize) {

    await queryInterface.removeColumn('Contents', 'bitchat_channel');

    await queryInterface.removeIndex('Contents', 'bitchat_channel', {
      indexName: 'content_bitchat_channels'
    })

  }
};
