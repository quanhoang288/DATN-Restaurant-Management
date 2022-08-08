const { CronJob } = require('cron');

const schedulerFactory = () => ({
  start(worker) {
    // eslint-disable-next-line no-new
    new CronJob(
      '00 * * * * *',
      () => {
        console.log('Running Worker... ');
        worker.run();
      },
      null,
      true,
      '',
    );
  },
});

module.exports = schedulerFactory();
