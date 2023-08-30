
import { Model, DataTypes } from 'sequelize'

import sequelize from '../src/sequelize'

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

  get class_name(): string {
        
      return this.getDataValue('class_name')
  }
}

SmartContract.init({
  class_name: DataTypes.STRING,
  class_id: DataTypes.STRING,
  origin: DataTypes.STRING,
  location: DataTypes.STRING,
  props: DataTypes.JSON,
  timestamp: DataTypes.INTEGER
}, {
  sequelize,
  modelName: 'SmartContract',
});
