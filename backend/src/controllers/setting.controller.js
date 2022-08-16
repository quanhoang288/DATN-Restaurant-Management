const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { settingService } = require('../services');

const saveSettings = catchAsync(async (req, res) => {
  await settingService.saveSettings(req.body.settings);
  return res.status(httpStatus.CREATED).json({
    message: 'Save settings successfully',
  });
});

const getSettings = catchAsync(async (req, res) => {
  const settings = await settingService.getSettings();
  return res.send(settings);
});

module.exports = {
  saveSettings,
  getSettings,
};
