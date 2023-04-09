const http = require('http');
const { Server } = require('socket.io');

const app = require('./app');
const config = require('./config/config');
const logger = require('./config/logger');

const server = http.createServer(app);

const io = new Server(server, { cors: '*' });

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('NEW_NOTIFICATION', (notification) => {
    console.log('receive new notification: ', notification);
    socket.broadcast.emit('NEW_NOTIFICATION', notification);
  });
});

server.listen(config.port, () => {
  logger.info(`Listening on port ${config.port}`);
});

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  console.log(error);
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});
