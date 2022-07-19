const AWS = require('aws-sdk');
const fs = require('fs');
const config = require('../config/config');

const s3 = new AWS.S3({
  accessKeyId: config.s3.accessKeyId,
  secretAccessKey: config.s3.secretAccessKey,
});

const uploadFile = async (filePath, originalFilename) => {
  const blob = fs.readFileSync(filePath);
  const uploadedFile = await s3
    .upload({
      Bucket: config.s3.bucketName,
      Key: originalFilename,
      Body: blob,
    })
    .promise();
  return uploadedFile;
};

const getFile = async () => {};

module.exports = {
  uploadFile,
  getFile,
};
