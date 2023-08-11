'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Video extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Video.init({
    origin: DataTypes.STRING,
    location: DataTypes.STRING,
    sha256_hash: DataTypes.STRING,
    ipfs_hash: DataTypes.STRING,
    segments: DataTypes.JSON,
    owner: DataTypes.STRING,
    operator: DataTypes.STRING,
    watch_price: DataTypes.INTEGER,
    ask_price: DataTypes.INTEGER,
    bid_price: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Video',
  });
  return Video;
};