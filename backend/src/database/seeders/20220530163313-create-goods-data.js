module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('goods', [
      {
        name: 'Bò xào nấm',
        import_price: 50000,
        sale_price: 70000,
        created_at: new Date(),
        updated_at: new Date(),
      },

      {
        name: 'Nấm xào',
        import_price: 50000,
        sale_price: 70000,
        created_at: new Date(),
        updated_at: new Date(),
      },

      {
        name: 'Gà chiên mắm',
        import_price: 50000,
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
