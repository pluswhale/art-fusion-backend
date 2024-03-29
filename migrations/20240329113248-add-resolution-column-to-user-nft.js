'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('UserNFTs', 'resolution', {
      type: Sequelize.STRING,
      allowNull: true,
      unique: false
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('UserNFTs', 'resolution');
  }
};
