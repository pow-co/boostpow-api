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
    signature: DataTypes.TEXT,
    content: DataTypes.STRING,
    timestamp: DataTypes.DATE,
    difficulty: DataTypes.DECIMAL,
    createdAt: { type: DataTypes.DATE, field: 'inserted_at' },
    updatedAt: { type: DataTypes.DATE, field: 'updated_at' }
  }, {
    sequelize,
    modelName: 'BoostWork',
    tableName: 'boost_job_proofs'
  });
  return BoostWork;
};
