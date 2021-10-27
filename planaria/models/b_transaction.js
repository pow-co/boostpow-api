'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BTransaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  BTransaction.init({
    txid: DataTypes.STRING,
    contentType: DataTypes.STRING,
    encoding: DataTypes.STRING,
    fileName: DataTypes.STRING,
    content: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'BTransaction',
  });
  return BTransaction;
};