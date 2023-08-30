
import { Model, DataTypes } from 'sequelize'

import sequelize from '../src/sequelize'

export class ContractMethodCall extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }

    get id(): string {

      return this.getDataValue('id')
    }

    get outpoint(): string {

      return this.getDataValue('outpoint')
    }

    get inpoint(): string {

      return this.getDataValue('inpoint')
    }

    get origin(): string {

      return this.getDataValue('origin')
    }

    get method(): string {

      return this.getDataValue('method')
    }

    get contractClass(): string {

      return this.getDataValue('contractClass')
    }

    get state(): any {

      return this.getDataValue('state')
    }


  }
  ContractMethodCall.init({
    contractClass: DataTypes.STRING,
    method: DataTypes.STRING,
    arguments: DataTypes.JSON,
    origin: DataTypes.STRING,
    inpoint: DataTypes.STRING,
    outpoint: DataTypes.STRING,
    state: DataTypes.JSON
  }, {
    sequelize,
    modelName: 'ContractMethodCall',
  });
