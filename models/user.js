'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.UserNFT, { foreignKey: 'userId', as: 'items' });
    }
  }
  User.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true, // Explicitly mark the 'id' field as a primary key
      autoIncrement: true, // Automatically increment the value
      allowNull: false
    },
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    // createdAt and updatedAt are automatically added by Sequelize for 'timestamps: true'
  }, {
    sequelize,
    modelName: 'User',
    timestamps: true, // Enable Sequelize to auto manage createdAt and updatedAt
  });
  return User;
};