const cron = require('node-cron');
const discountController = require('../controllers/discount.controller');
// * * * * * * every secound
// 0 * * * * * every minute
// 0 0 0 * * * every hours
// 0 0 0 0 * * every day at 00:00 TN TIME
// Schedule the task to run Every minutes
const task = cron.schedule('0 0 0 * * *', () => {
  console.log('Running scheduled task to check for expired discounts');
  discountController.deactivateDiscounts();
}, {
  scheduled: true,
  timezone: "Africa/Tunis"
});

task.start();
