'use strict';

const { password } = require('pg/lib/defaults');

const demoUsers = [
  {
      firstName: 'John',
      lastName: 'Doe',
    email: 'saranyaprasertsang@yahoo.com',
    password: 'Hodbos929%',
            createdAt: new Date(),
      updatedAt: new Date()

  },
  {
      firstName: 'John',
      lastName: 'Doe',
    email: 'ferrucio_@hotmail.com',
    password: 'Phpwp902J99$',
          createdAt: new Date(),
      updatedAt: new Date()
      
  },
  {
      firstName: 'John',
      lastName: 'Doe',
    email: 'anyakaewthamai@gmail.com',
      password: 'sojsIos92L',
      createdAt: new Date(),
      updatedAt: new Date()
  },

]

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', demoUsers);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
