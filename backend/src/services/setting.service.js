const httpStatus = require('http-status');
const db = require('../database/models');
const ApiError = require('../exceptions/api-error');

const saveSettings = async (data) =>
  Promise.all(
    data.map(async (setting) => {
      const { name, value } = setting;
      const settingToSave = await db.Setting.findOne({
        where: {
          name,
        },
      });
      if (settingToSave && settingToSave.value !== value) {
        settingToSave.set({ value });
        await settingToSave.save();
      } else {
        await db.Setting.create(setting);
      }
    }),
  );

const getSettings = async (params = {}) => db.Setting.findAll();

module.exports = {
  saveSettings,
  getSettings,
};
