'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Content extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Content.init({
    txid: DataTypes.STRING,
    content_type: DataTypes.STRING,
    locked_value: {
      type: DataTypes.INTEGER,
      get() {
        return parseInt(this.getDataValue('locked_value'))
      }
    },
    unlocked_value: {
      type: DataTypes.INTEGER,
      get() {
        return parseInt(this.getDataValue('unlocked_value'))
      }
    },
    work_ordered: {
      type: DataTypes.DECIMAL,
      get() {
        return parseFloat(this.getDataValue('work_ordered'))
      }
    },
    work_performed: {
      type: DataTypes.DECIMAL,
      get() {
        return parseFloat(this.getDataValue('work_ordered'))
      }
    }
  }, {
    sequelize,
    modelName: 'Content',
  });
  return Content;
};
