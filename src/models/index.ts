'use strict';

require('dotenv').config()

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);

import nconf from '../config'

const env = nconf.get('node_env');

const config = require(__dirname + '/../../config/config.json')[env];

const db: any = {};

const sequelize = new Sequelize(process.env[config.use_env_variable], config);

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.BoostJob.hasMany(db.Content, {
  as: '_content',
  foreignKey: 'txid',
  sourceKey: 'content'
})

db.BoostWork.hasMany(db.Content, {
  as: '_content',
  foreignKey: 'txid',
  sourceKey: 'content'
})

db.Content.hasMany(db.BoostWork, {
  as: 'boost_work',
  foreignKey: 'content',
  sourceKey: 'txid'
})

db.Content.hasMany(db.BoostJob, {
  as: 'boost_jobs',
  foreignKey: 'content',
  sourceKey: 'txid'
})

export default db
