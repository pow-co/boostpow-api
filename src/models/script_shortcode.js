'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ScriptShortcode extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ScriptShortcode.init({
    script: DataTypes.TEXT,
    uid: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'ScriptShortcode',
  });
  return ScriptShortcode;
};