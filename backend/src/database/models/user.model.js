const { Model } = require('sequelize');
const bcrypt = require('bcryptjs');
const { id, dateTime } = require('../generate');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // define association here
    }

    static async isEmailAlreadyUsed(email) {
      const existingUser = await User.findOne({
        where: {
          email,
        },
      });
      return existingUser !== null;
    }

    async isPasswordMatch(password) {
      return bcrypt.compare(password, this.password);
    }

    isRefreshTokenValid(refreshToken) {
      return (
        this.refresh_token === refreshToken &&
        this.refresh_token_expires_at > new Date()
      );
    }

    isEmailVerifyTokenValid(emailVerifyToken) {
      return (
        this.email_verify_token === emailVerifyToken &&
        this.email_verify_token_expires_at > new Date()
      );
    }

    isPasswordResetTokenValid(passwordResetToken) {
      return (
        this.password_reset_token === passwordResetToken &&
        this.password_reset_token_expires_at > new Date()
      );
    }
  }
  User.init(
    {
      ...id(DataTypes),
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      full_name: {
        type: DataTypes.STRING,
      },
      address: {
        type: DataTypes.STRING,
      },
      email_verified: {
        type: DataTypes.TINYINT,
      },
      refresh_token: {
        type: DataTypes.STRING,
      },
      refresh_token_expires_at: {
        type: DataTypes.DATE,
      },
      email_verify_token: {
        type: DataTypes.STRING,
      },
      email_verify_token_expires_at: {
        type: DataTypes.DATE,
      },
      password_rest_token: {
        type: DataTypes.STRING,
      },
      password_rest_token_expires_at: {
        type: DataTypes.DATE,
      },
      ...dateTime(DataTypes),
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'users',
    },
  );
  return User;
};