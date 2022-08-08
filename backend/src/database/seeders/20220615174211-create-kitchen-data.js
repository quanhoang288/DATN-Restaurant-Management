module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'kitchens',
      [
        {
          name: 'Bếp 1',
          branch_id: 1,
          type: 'food',
          floor_num: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: 'Quầy pha chế 1',
          branch_id: 1,
          type: 'beverage',
          floor_num: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: 'Bếp 1',
          branch_id: 2,
          type: 'food',
          floor_num: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: 'Quầy pha chế 1',
          branch_id: 2,
          type: 'beverage',
          floor_num: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: 'Bếp 1',
          branch_id: 3,
          type: 'food',
          floor_num: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: 'Quầy pha chế 1',
          branch_id: 3,
          type: 'beverage',
          floor_num: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {},
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('kitchens', null, {});
  },
};
