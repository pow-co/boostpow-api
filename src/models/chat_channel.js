'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ChatChannel extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ChatChannel.init({
    channel: DataTypes.STRING,
    last_message_bmap: DataTypes.JSON,
    last_message_timestamp: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'ChatChannel',
  });
  return ChatChannel;
};