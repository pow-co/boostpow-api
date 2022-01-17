'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
     await queryInterface.addColumn('Contents', 'content_json', { type: Sequelize.JSON });
  },

  down: async (queryInterface, Sequelize) => {
     await queryInterface.removeColumn('Contents', 'content_json');
  }
};
