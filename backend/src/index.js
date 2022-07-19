const http = require('http');
const { Server } = require('socket.io');

const app = require('./app');
const config = require('./config/config');
const logger = require('./config/logger');

const server = http.createServer(app);

const io = new Server(server, { cors: '*' });

io.on('test', (data) => console.log(data));

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('test', (data) => console.log(data));
});

// Socket.io middleware
app.use((req, res, next) => {
  req.io = io;
  next();
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
