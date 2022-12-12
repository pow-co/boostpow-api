'use strict';

require('dotenv').config()


import * as fs from 'fs'
import * as path from 'path'

import { Sequelize, DataTypes } from 'sequelize'

const basename = path.basename(__filename);

import nconf from '../config'

const env = nconf.get('node_env');

const config = require(__dirname + '/../../config/config.json')[env];

interface Database {

  BoostJob: any;
  BoostWork: any;
  sequelize: any;
  Content: any;
  Sequelize: any;
  Block: any;
};

var db: Database | any = {};

const sequelize = new Sequelize(process.env[config.use_env_variable], config);

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const module = require(path.join(__dirname, file))

    const model = module(sequelize, DataTypes);

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
