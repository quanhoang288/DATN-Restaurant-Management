const reservationService = require('../services/reservation.service');

const reminderWorkerFactory = () => ({
  run() {
    return reservationService.sendReminders();
  },
});

module.exports = reminderWorkerFactory();
