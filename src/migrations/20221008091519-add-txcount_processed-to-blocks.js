'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

     await queryInterface.addColumn('blocks', 'txcount_processed', {
      type: Sequelize.INTEGER,
      defaultValue: 0
     });
  },

  down: async (queryInterface, Sequelize) => {

     await queryInterface.removeColumn('blocks', 'txcount_processed');
  }
};
