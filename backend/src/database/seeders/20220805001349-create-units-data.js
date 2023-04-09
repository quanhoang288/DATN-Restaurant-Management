module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('units', [
      {
        name: 'kg',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'g',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'ml',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'l',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'gói',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'hộp',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('units', null, {});
  },
};
