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

      models.Content.hasMany(models.BoostWork, {
        as: 'boost_work',
        foreignKey: 'content',
        sourceKey: 'txid'
      })

      models.Content.hasMany(models.BoostJob, {
        as: 'boost_jobs',
        foreignKey: 'content',
        sourceKey: 'txid'
      })
      // define association here
    }
  }
  Content.init({
    txid: DataTypes.STRING,
    content_type: DataTypes.STRING,
    content_json: DataTypes.JSON,
    content_text: DataTypes.TEXT,
    content_bytes: DataTypes.BLOB
  }, {
    sequelize,
    modelName: 'Content',
  });
  return Content;
};
