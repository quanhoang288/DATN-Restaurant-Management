const express = require('express');
const cors = require('cors');
const httpStatus = require('http-status');
const routes = require('./routes/v1');
const { errorConverter, errorHandler } = require('./middlewares/error');
const ApiError = require('./exceptions/api-error');
const s3Service = require('./services/s3.service');
// const scheduler = require('./factories/schedulerFactory');
// const reminderWorker = require('./workers/reminderWorker');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// enable cors
app.use(cors());
app.options('*', cors());

// download images from s3
app.get('/public/images/:key', (req, res) => {
  try {
    const fileStream = s3Service.getFileStream(req.params.key);
    fileStream.pipe(res);
  } catch (err) {
    console.log(err);
  }
});

app.get('/public/templates/:key', (req, res) => {
  try {
    const fileStream = s3Service.getFileStream(req.params.key);
    res.set('Content-Disposition', 'attachment');
    fileStream.pipe(res);
  } catch (err) {
    console.log(err);
  }
});

// v1 api routes
app.use('/api/v1', routes);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

// scheduler.start(reminderWorker);

module.exports = app;
