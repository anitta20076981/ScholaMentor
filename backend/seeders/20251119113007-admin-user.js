'use strict';
const bcrypt = require('bcrypt');

module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash('admin', 10); // 10 is salt rounds
    return queryInterface.bulkInsert('Users', [
      {
        name: 'Admin',
        email: 'admin@gmail.com',
        password: hashedPassword,
        type: 'admin',
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Users', { email: 'admin@gmail.com' }, {});
  }
};
