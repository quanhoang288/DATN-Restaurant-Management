const { CronJob } = require('cron');

const schedulerFactory = () => ({
  start(worker) {
    // eslint-disable-next-line no-new
    new CronJob(
      '00 * * * * *',
      async () => {
        console.log('Running Worker... ');
        await worker.run();
      },
      null,
      true,
      '',
    );
  },
});

module.exports = schedulerFactory();
