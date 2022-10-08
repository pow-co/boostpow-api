'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Block extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Block.init({
    hash: {
      type: DataTypes.STRING,
      allowNull: false
    },
    height: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    processed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    boost_proofs: {
      type: DataTypes.JSON,
      defaultValue: []
    },
    boost_jobs: {
      type: DataTypes.JSON,
      defaultValue: []
    },
    size: {
      type: DataTypes.INTEGER 
    },
    txcount: {
      type: DataTypes.INTEGER
    }
  }, {
    sequelize,
    modelName: 'Block',
    tableName: 'blocks'
  });
  return Block;
};
