'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('UserNFTs', 'imageUrl', {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn('UserNFTs', 'metadataUrl', {
      type: Sequelize.STRING,
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('UserNFTs', 'imageUrl');
    await queryInterface.removeColumn('UserNFTs', 'metadataUrl');
  }
};
