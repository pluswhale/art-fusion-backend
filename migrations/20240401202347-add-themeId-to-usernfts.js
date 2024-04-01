'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('UserNFTs', 'themeId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'CollectionThemes',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('UserNFTs', 'themeId');
  }
};