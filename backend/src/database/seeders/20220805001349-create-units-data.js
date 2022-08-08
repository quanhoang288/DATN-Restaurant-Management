module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('units', [
      {
        name: 'kg',
      },
      {
        name: 'g',
      },
      {
        name: 'ml',
      },
      {
        name: 'l',
      },
      {
        name: 'gói',
      },
      {
        name: 'hộp',
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('units', null, {});
  },
};
