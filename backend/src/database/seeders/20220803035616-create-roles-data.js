module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('roles', [
      {
        code: 'cashier',
        name: 'Thu ngân',
      },
      {
        code: 'server',
        name: 'Phục vụ',
      },
      {
        code: 'cook',
        name: 'Đầu bếp',
      },
      {
        code: 'bartender',
        name: 'Nhân viên pha chế',
      },
      {
        code: 'shipper',
        name: 'Nhân viên giao hàng',
      },
      {
        code: 'branch-manager',
        name: 'Quản lý chi nhánh',
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('roles', null, {});
  },
};
