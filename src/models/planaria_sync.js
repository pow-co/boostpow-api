'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class planaria_sync extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  planaria_sync.init({
    query: {
      type: DataTypes.JSON,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    timestamp: DataTypes.DATE,
    block_index: DataTypes.INTEGER,
    block_hash: DataTypes.STRING,
    block_tx_index: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'PlanariaSync',
    tableName: 'planaria_syncs'
  });
  return planaria_sync;
};