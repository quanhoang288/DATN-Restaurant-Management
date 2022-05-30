const info = (message, ...params) => {
  message.logLevel = 'INFO'
  if (typeof message === 'object') {
    console.info(JSON.stringify(message), ...params);
  } else {
    console.info(message, ...params);
  }
};

const warning = (message, ...params) => {
  message.logLevel = 'WARNING'
  if (typeof message === 'object') {
    console.warn(JSON.stringify(message), ...params);
  } else {
    console.warn(message, ...params);
  }
};

const error = (message, ...params) => {
  message.logLevel = 'ERROR'
  if (typeof message === 'object') {
    console.error(JSON.stringify(message), ...params);
  } else {
    console.error(message, ...params);
  }
};

const fatal = (message, ...params) => {
  message.logLevel = 'FATAL'
  if (typeof message === 'object') {
    console.error(JSON.stringify(message), ...params);
  } else {
    console.error(message, ...params);
  }
};


module.exports = {
  info,
  warning,
  error,
  fatal,
};
