const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { assetDir } = require('../config/config');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const destinationPath = path.resolve(__dirname, assetDir);
    if (!fs.existsSync(path.resolve(__dirname, assetDir))) {
      fs.mkdirSync(path.resolve(__dirname, assetDir), { recursive: true });
    }
    cb(null, destinationPath);
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `${
        path.basename(file.originalname).split('.')[0]
      }-${Date.now()}${path.extname(file.originalname)}`,
    );
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    validateFileType(file, cb);
  },
});

const validateFileType = (file, cb) => {
  const allowedFileTypes = /jpg|jpeg|png|xlsx/;
  const extName = allowedFileTypes.test(
    path.extname(file.originalname).toLowerCase(),
  );

  if (extName) {
    return cb(null, true);
  }

  return cb(
    new Error('Invalid file extension or unsupported mime type'),
    false,
  );
};

module.exports = upload;
