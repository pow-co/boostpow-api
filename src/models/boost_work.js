'use strict';
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
    }
  };
  BoostWork.init({
    spend_txid: DataTypes.STRING,
    spend_vout: DataTypes.INTEGER,
    job_txid: DataTypes.STRING,
    job_vout: DataTypes.INTEGER,
    value: {
      type: DataTypes.INTEGER,
      allowNull: false
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
      allowNull: false
    },
    tag: {
      type: DataTypes.STRING,
      allowNull: true
    },
    createdAt: { type: DataTypes.DATE },
    updatedAt: { type: DataTypes.DATE }
  }, {
    sequelize,
    modelName: 'BoostWork',
    tableName: 'boost_job_proofs'
  });
  return BoostWork;
};
