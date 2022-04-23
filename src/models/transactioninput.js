'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TransactionInput extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  TransactionInput.init({
    txid: DataTypes.STRING,
    input_txid: DataTypes.STRING,
    input_index: DataTypes.INTEGER,
    block_height: DataTypes.STRING,
    block_hash: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'TransactionInput',
  });
  return TransactionInput;
};
