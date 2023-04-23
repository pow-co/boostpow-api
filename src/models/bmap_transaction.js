'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BmapTransaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  BmapTransaction.init({
    bmap: DataTypes.JSON,
    bob: DataTypes.JSON,
    hex: DataTypes.TEXT,
    txid: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'BmapTransaction',
  });
  return BmapTransaction;
};