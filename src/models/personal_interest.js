'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PersonalInterest extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  PersonalInterest.init({
    owner: DataTypes.STRING,
    origin: DataTypes.STRING,
    location: DataTypes.STRING,
    topic: DataTypes.STRING,
    value: DataTypes.INTEGER,
    weight: DataTypes.INTEGER,
    active: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'PersonalInterest',
  });
  return PersonalInterest;
};
