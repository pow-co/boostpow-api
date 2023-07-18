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
    contract_class_id: DataTypes.STRING,
    owner: DataTypes.STRING,
    origin: DataTypes.STRING,
    location: DataTypes.STRING,
    script_hash: DataTypes.STRING,
    script: DataTypes.STRING,
    topic: DataTypes.STRING,
    value: DataTypes.INTEGER,
    weight: DataTypes.INTEGER,
    props: DataTypes.JSON,
    active: DataTypes.BOOLEAN,
    removal_location: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'PersonalInterest',
  });
  return PersonalInterest;
};
