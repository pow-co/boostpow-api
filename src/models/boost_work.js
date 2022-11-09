
'use strict';

const BigNumber = require('bignumber.js')

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BoostWork extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      models.BoostWork.hasMany(models.Content, {
        as: 'content',
        foreignKey: 'txid',
        sourceKey: 'content'
      })
    }
  };
  BoostWork.init({
    spend_txid: DataTypes.STRING,
    spend_vout: DataTypes.INTEGER,
    job_txid: DataTypes.STRING,
    job_vout: DataTypes.INTEGER,
    value: {
      type: DataTypes.INTEGER,
      allowNull: false,
      get() {
        return parseInt(this.getDataValue('value'))
      }
    },
    profitability: {
      type: DataTypes.DECIMAL,
      get() {
        return parseFloat(this.getDataValue('profitability'))
      }
    },
    signature: DataTypes.TEXT,
    content: {
      type: DataTypes.STRING,
      allowNull: false
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false
    },
    difficulty: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      get() {
        return parseFloat(this.getDataValue('difficulty'))
      }
    },
    tag: {
      type: DataTypes.STRING,
      allowNull: true
    },
    miner: DataTypes.STRING,
    tx_hex: DataTypes.TEXT,
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
    modelName: 'BoostWork',
    tableName: 'boost_job_proofs'
  });
  return BoostWork;
};
