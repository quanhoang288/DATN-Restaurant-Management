const AWS = require('aws-sdk');
const fs = require('fs');
const config = require('../config/config');

const { accessKeyId, bucketName, secretAccessKey } = config.s3;

const s3 = new AWS.S3({
  accessKeyId,
  secretAccessKey,
});

const uploadFile = (filePath, originalFilename) => {
  const blob = fs.readFileSync(filePath);
  return s3
    .upload({
      Bucket: config.s3.bucketName,
      Key: originalFilename,
      Body: blob,
    })
    .promise();
};

const getFileStream = (fileKey) => {
  const downloadParams = {
    Key: fileKey,
    Bucket: bucketName,
  };

  return s3.getObject(downloadParams).createReadStream();
};

const generatePresignedUrl = async (fileKey, expires = 900) => {
  const signedUrl = s3.getSignedUrl('getObject', {
    Key: fileKey,
    Bucket: config.s3.bucketName,
    Expires: expires,
  });
  return signedUrl;
};

module.exports = {
  uploadFile,
  getFileStream,
  generatePresignedUrl,
};
