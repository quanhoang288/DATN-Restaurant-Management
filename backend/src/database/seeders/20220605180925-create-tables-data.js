module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('tables', [
      {
        name: 'Bàn 1',
        floor_num: 1,
        order: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Bàn 2',
        floor_num: 1,
        order: 2,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Bàn 3',
        floor_num: 1,
        order: 4,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Bàn 4',
        floor_num: 2,
        order: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Bàn 5',
        floor_num: 2,
        order: 2,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('tables');
  },
};
