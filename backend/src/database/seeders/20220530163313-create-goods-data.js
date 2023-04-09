module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('goods', [
      {
        name: 'Bò xào nấm',
        sale_price: 70000,
        created_at: new Date(),
        updated_at: new Date(),
      },

      {
        name: 'Nấm xào',
        sale_price: 70000,
        created_at: new Date(),
        updated_at: new Date(),
      },

      {
        name: 'Gà chiên mắm',
        sale_price: 70000,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('goods', null, {});
  },
};
