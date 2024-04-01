'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CollectionTheme extends Model {
    static associate(models) {
      // Define association here
      CollectionTheme.hasMany(models.UserNFT, { foreignKey: 'themeId', as: 'nfts' });
    }
  };
  CollectionTheme.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'CollectionTheme',
  });
  return CollectionTheme;
};