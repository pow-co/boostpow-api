'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
     await queryInterface.addColumn('Contents', 'content_text', { type: Sequelize.TEXT });
     await queryInterface.addColumn('Contents', 'content_bytes', { type: Sequelize.BLOB });
  },

  down: async (queryInterface, Sequelize) => {
     await queryInterface.removeColumn('Contents', 'content_text');
     await queryInterface.removeColumn('Contents', 'content_bytes');
  }
};
