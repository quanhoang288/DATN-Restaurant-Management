const bcrypt = require('bcryptjs');
const db = require('../models');

const { Op } = db.Sequelize;

module.exports = {
  async up(queryInterface, Sequelize) {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash('123456', salt);
    await queryInterface.bulkInsert('users', [
      {
        email: 'admin@gmail.com',
        password: hashedPassword,
        full_name: 'Hoang Huy Quan',
        is_admin: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.delete('users', {
      where: {
        email: 'admin@gmail.com',
      },
    });
  },
};
