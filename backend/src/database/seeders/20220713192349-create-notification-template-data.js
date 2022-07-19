const bcrypt = require('bcryptjs');
const { NotificationType } = require('../../constants');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('notification_templates', null, {});
    await queryInterface.bulkInsert(
      'notification_templates',
      Object.keys(NotificationType).map((key) => NotificationType[key]),
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('notification_templates', null, {});
  },
};
