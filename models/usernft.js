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
      UserNFT.belongsTo(models.CollectionTheme, { foreignKey: 'themeId', as: 'theme' });
    }
  }
  UserNFT.init({
    userId: DataTypes.INTEGER,
    itemId: DataTypes.STRING,
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    cid: DataTypes.STRING,
    minted: DataTypes.BOOLEAN,
    resolution: DataTypes.STRING,
    themeId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'CollectionTheme', // Name of the CollectionTheme model
        key: 'id', // Key in CollectionTheme model that UserNFT references
      },
    },
    imageUrl: DataTypes.STRING,
    metadataUrl: DataTypes.STRING,
            
  }, {
    sequelize,
    modelName: 'UserNFT',
  });
  return UserNFT;
};