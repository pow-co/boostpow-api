'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Threshold extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Threshold.init({
    paymail: DataTypes.STRING,
    telegram_id: DataTypes.INTEGER,
    value: DataTypes.DECIMAL
  }, {
    sequelize,
    modelName: 'Threshold',
  });
  return Threshold;
};
