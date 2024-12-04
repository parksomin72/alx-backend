// File: 8-job.js

import kue from 'kue';

/**
 * Creates push notification jobs.
 * @param {Array} jobs - An array of job objects.
 * @param {Object} queue - The Kue queue instance.
 * @throws {Error} If jobs is not an array.
 */
export default function createPushNotificationsJobs(jobs, queue) {
  if (!Array.isArray(jobs)) {
    throw new Error('Jobs is not an array');
  }

  jobs.forEach((jobData) => {
    const job = queue.create('push_notification_code_3', jobData)
      .save((err) => {
        if (!err) {
          // Log only if `job.id` exists (in normal mode, not in test mode)
          if (job.id !== undefined) {
            console.log(`Notification job created: ${job.id}`);
          }
        } else {
          console.error(`Failed to create notification job: ${err.message}`);
        }
      });

    job.on('complete', () => {
      if (job.id !== undefined) {
        console.log(`Notification job ${job.id} completed`);
      }
    });

    job.on('failed', (err) => {
      if (job.id !== undefined) {
        console.log(`Notification job ${job.id} failed: ${err}`);
      }
    });

    job.on('progress', (progress) => {
      if (job.id !== undefined) {
        console.log(`Notification job ${job.id} ${progress}% complete`);
      }
    });
  });
}
