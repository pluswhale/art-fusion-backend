'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserNFT extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      UserNFT.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    }
  }
  UserNFT.init({
    userId: DataTypes.INTEGER,
    itemId: DataTypes.STRING,
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    cid: DataTypes.STRING,
    minted: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'UserNFT',
  });
  return UserNFT;
};