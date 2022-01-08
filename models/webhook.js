'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Webhook extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Webhook.init({
    url: DataTypes.TEXT,
    content_txid: DataTypes.STRING,
    category: DataTypes.STRING,
    paymail: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Webhook',
  });
  return Webhook;
};