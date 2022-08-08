const { id, dateTime } = require('../generate');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      ...id(Sequelize.DataTypes),
      avatar: {
        type: Sequelize.DataTypes.STRING,
      },
      email: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      full_name: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      address: {
        type: Sequelize.DataTypes.STRING,
      },
      phone_number: {
        type: Sequelize.DataTypes.STRING,
      },
      email_verified: {
        type: Sequelize.DataTypes.TINYINT.UNSIGNED,
      },
      is_admin: {
        type: Sequelize.DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 0,
      },
      refresh_token: {
        type: Sequelize.DataTypes.STRING,
      },
      refresh_token_expires_at: {
        type: Sequelize.DataTypes.DATE,
      },
      email_verify_token: {
        type: Sequelize.DataTypes.STRING,
      },
      email_verify_token_expires_at: {
        type: Sequelize.DataTypes.DATE,
      },
      password_rest_token: {
        type: Sequelize.DataTypes.STRING,
      },
      password_rest_token_expires_at: {
        type: Sequelize.DataTypes.DATE,
      },
      ...dateTime(Sequelize.DataTypes),
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  },
};
