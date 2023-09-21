
import { Model, DataTypes } from 'sequelize'

import sequelize from '../sequelize'

export class SmartContract extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
  }

  get id(): number {
      
    return this.getDataValue('id')

  }

  get origin(): string {
      
      return this.getDataValue('origin')
  }

  get location(): string {
      
    return this.getDataValue('location')
}

  get class_name(): string {
        
      return this.getDataValue('class_name')
  }

  set txid(value) {

      this.setDataValue('txid', value)
  }

  set vout(value) {

      this.setDataValue('vout', value)
  }

  get props() {

    return this.getDataValue('props')
  }

  set balance(amount) {

    this.setDataValue('balance', amount)
  }
}

SmartContract.init({
  class_name: DataTypes.STRING,
  class_id: DataTypes.STRING,
  origin: DataTypes.STRING,
  txid: DataTypes.STRING,
  vout: DataTypes.INTEGER,
  location: DataTypes.STRING,
  props: DataTypes.JSON,
  balance: DataTypes.INTEGER,
  timestamp: DataTypes.INTEGER
}, {
  sequelize,
  modelName: 'SmartContract',
});
