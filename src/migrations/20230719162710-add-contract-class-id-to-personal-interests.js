'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('PersonalInterests', 'contract_class_id', { type: Sequelize.STRING })
    await queryInterface.addColumn('PersonalInterests', 'unlock_location', { type: Sequelize.STRING })
    await queryInterface.addColumn('PersonalInterests', 'props', { type: Sequelize.JSON })
    await queryInterface.addColumn('PersonalInterests', 'code_part_script', { type: Sequelize.TEXT })
    await queryInterface.addColumn('PersonalInterests', 'data_part_script', { type: Sequelize.TEXT })
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('PersonalInterests', 'contract_class_id')
    await queryInterface.removeColumn('PersonalInterests', 'unlock_location')
    await queryInterface.removeColumn('PersonalInterests', 'props')
    await queryInterface.removeColumn('PersonalInterests', 'code_part_script')
    await queryInterface.removeColumn('PersonalInterests', 'data_part_script')
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
