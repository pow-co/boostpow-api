'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BoostJob extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  BoostJob.init({
    content: DataTypes.STRING,
    difficulty: DataTypes.DECIMAL,
    category: DataTypes.STRING,
    tag: DataTypes.STRING,
    additionalData: DataTypes.TEXT,
    userNonce: DataTypes.STRING,
    txid: DataTypes.STRING,
    vout: DataTypes.INTEGER,
    value: DataTypes.INTEGER,
    timestamp: DataTypes.DATE,
    spent: DataTypes.BOOLEAN,
    script: DataTypes.TEXT,
    spent_txid: DataTypes.STRING,
    spent_vout: DataTypes.INTEGER,
    createdAt: { type: DataTypes.DATE },
    updatedAt: { type: DataTypes.DATE }
  }, {
    sequelize,
    modelName: 'BoostJob',
    tableName: 'boost_jobs'
  });
  return BoostJob;
};
