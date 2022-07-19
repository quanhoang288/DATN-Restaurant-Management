const reservationService = require('../services/reservation.service');

const reminderWorkerFactory = () => {
  console.log('reminder worker');
  return {
    async run() {
      return reservationService.sendReminders();
    },
  };
};

module.exports = reminderWorkerFactory();
