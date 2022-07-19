const bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface, Sequelize) {
    const salt = await bcrypt.genSalt();
    console.log('salt: ', salt);
    const hashedPassword = await bcrypt.hash('123456', salt);
    console.log('hashed password: ', hashedPassword);
    await queryInterface.bulkInsert('users', [
      {
        email: 'admin@gmail.com',
        password: hashedPassword,
        full_name: 'Hoang Huy Quan',
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
