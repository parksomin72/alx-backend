import kue from 'kue';

const blacklistedNumbers = ['4153518780', '4153518781'];

/**
 * Sends a notification.
 * @param {string} phoneNumber - The phone number to send the notification to.
 * @param {string} message - The message to send.
 * @param {object} job - The job object.
 * @param {function} done - The callback to signal completion.
 */
function sendNotification(phoneNumber, message, job, done) {
  job.progress(0, 100);

  if (blacklistedNumbers.includes(phoneNumber)) {
    done(new Error(`Phone number ${phoneNumber} is blacklisted`));
    return;
  }

  job.progress(50, 100);
  console.log(`Sending notification to ${phoneNumber}, with message: ${message}`);
  done();
}

const queue = kue.createQueue();

queue.process('push_notification_code_2', 2, (job, done) => {
  const { phoneNumber, message } = job.data;
  sendNotification(phoneNumber, message, job, done);
});
