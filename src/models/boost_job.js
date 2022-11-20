
'use strict';

const BigNumber = require('bignumber.js')

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

      models.BoostJob.hasMany(models.Content, {
        as: 'content',
        foreignKey: 'txid',
        sourceKey: 'content'
      })
      // define association here
    }
  };
  BoostJob.init({
    content: DataTypes.STRING,
    difficulty: {
      type: DataTypes.DECIMAL,
      get() {
        return parseFloat(this.getDataValue('difficulty'))
      }
    },
    category: DataTypes.STRING,
    tag: DataTypes.STRING,
    additionalData: DataTypes.TEXT,
    userNonce: DataTypes.STRING,
    txid: DataTypes.STRING,
    vout: DataTypes.INTEGER,
    value: DataTypes.INTEGER,
    profitability: {
      type: DataTypes.DECIMAL,
      get() {
        return parseFloat(this.getDataValue('profitability'))
      }
    },
    tx_hex: DataTypes.TEXT,
    timestamp: DataTypes.DATE,
    spent: DataTypes.BOOLEAN,
    script: DataTypes.TEXT,
    spent_txid: DataTypes.STRING,
    spent_vout: DataTypes.INTEGER,
    createdAt: { type: DataTypes.DATE },
    updatedAt: { type: DataTypes.DATE }
  }, {
    hooks: {
      beforeCreate: (job, options) => {
        let difficulty = new BigNumber(job.difficulty)
        let value = new BigNumber(job.value)
        job.profitability = value.dividedBy(difficulty).toNumber()
      }
    },
    sequelize,
    modelName: 'BoostJob',
    tableName: 'boost_jobs'
  });
  return BoostJob;
};
