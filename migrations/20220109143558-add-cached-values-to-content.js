'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    await queryInterface.addColumn('Contents', 'locked_value', { type: Sequelize.INTEGER });
    await queryInterface.addColumn('Contents', 'unlocked_value', { type: Sequelize.INTEGER });

    await queryInterface.addColumn('Contents', 'work_ordered', { type: Sequelize.DECIMAL });
    await queryInterface.addColumn('Contents', 'work_performed', { type: Sequelize.DECIMAL });
  },

  down: async (queryInterface, Sequelize) => {

    await queryInterface.removeColumn('Contents', 'locked_value');
    await queryInterface.removeColumn('Contents', 'unlocked_value');

    await queryInterface.removeColumn('Contents', 'work_ordered');
    await queryInterface.removeColumn('Contents', 'work_performed');

  }
};
