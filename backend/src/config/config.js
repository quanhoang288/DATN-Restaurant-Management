const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string()
      .valid('production', 'development', 'test')
      .required(),
    PORT: Joi.number().default(3000),
    JWT_SECRET: Joi.string().required().description('JWT secret key'),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number()
      .default(30)
      .description('minutes after which access tokens expire'),
    JWT_REFRESH_EXPIRATION_DAYS: Joi.number()
      .default(30)
      .description('days after which refresh tokens expire'),
    JWT_RESET_PASSWORD_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description('minutes after which reset password token expires'),
    JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description('minutes after which verify email token expires'),
    // SMTP_HOST: Joi.string().description('server that will send the emails'),
    // SMTP_PORT: Joi.number().description('port to connect to the email server'),
    // SMTP_USERNAME: Joi.string().description('username for email server'),
    // SMTP_PASSWORD: Joi.string().description('password for email server'),
    // EMAIL_FROM: Joi.string().description(
    //   'the from field in the emails sent by the app',
    // ),
    DB_USER: Joi.string().description('database username'),
    DB_PASSWORD: Joi.string().description('password of database user'),
    DB_NAME: Joi.string().description('database to connect to'),
    DB_HOST: Joi.string().description('database server to connect to'),
    DB_PORT: Joi.string().description('database port to connect to'),
    AWS_S3_ACCESS_KEY_ID: Joi.string().description('S3 access key id'),
    AWS_S3_SECRET_ACCESS_KEY: Joi.string().description('S3 secret key'),
    AWS_S3_BUCKET_NAME: Joi.string().description('Bucket name'),
    TWILIO_ACCOUNT_SID: Joi.string().description('Twilio account id'),
    TWILIO_AUTH_TOKEN: Joi.string().description('Twilio authentication token'),
    TWILIO_PHONE_NUMBER: Joi.string().description(
      'Twilio phone number to send messages',
    ),
    VONAGE_API_KEY: Joi.string(),
    VONAGE_API_SECRET: Joi.string(),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema
  .prefs({ errors: { label: 'key' } })
  .validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  db: {
    username: envVars.DB_USER,
    password: envVars.DB_PASSWORD,
    database: envVars.DB_NAME,
    host: envVars.DB_HOST,
    port: envVars.DB_PORT,
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
    resetPasswordExpirationMinutes:
      envVars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
    verifyEmailExpirationMinutes: envVars.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
  },
  email: {
    smtp: {
      host: envVars.SMTP_HOST,
      port: envVars.SMTP_PORT,
      auth: {
        user: envVars.SMTP_USERNAME,
        pass: envVars.SMTP_PASSWORD,
      },
    },
    from: envVars.EMAIL_FROM,
  },
  tokenType: {
    ACCESS: 'access',
    REFRESH: 'refresh',
    EMAIL_VERIFY: 'email_verify',
    PASSWORD_RESET: 'password_reset',
  },
  s3: {
    accessKeyId: envVars.AWS_S3_ACCESS_KEY_ID,
    secretAccessKey: envVars.AWS_S3_SECRET_ACCESS_KEY,
    bucketName: envVars.AWS_S3_BUCKET_NAME,
  },
  twilio: {
    accountId: envVars.TWILIO_ACCOUNT_SID,
    authToken: envVars.TWILIO_AUTH_TOKEN,
    phoneNumber: envVars.TWILIO_PHONE_NUMBER,
  },
  nexmo: {
    apiKey: envVars.VONAGE_API_KEY,
    apiSecret: envVars.VONAGE_API_SECRET,
  },
};
