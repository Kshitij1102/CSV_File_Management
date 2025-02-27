import { createQueue } from '../lib/jobQueue';
import { batchAddUsers } from '../lib/userApi';

// Create a queue consumer
const userQueue = createQueue('user-processing');

// Process jobs
userQueue.process('process-users', async (job) => {
  const { records } = job.data;
  
  console.log(`Starting to process ${records.length} users from job ${job.id}`);
  
  // Set initial progress
  await job.progress(0);
  
  try {
    // Batch add users with progress updates
    const results = await batchAddUsers(records, async (progress) => {
      await job.progress(progress);
    });
    
    // Log results
    console.log(`Job ${job.id} processed ${results.successful} out of ${results.total} users`);
    
    // Return results in the job completion
    return {
      processed: results.successful,
      failed: results.failed,
      total: results.total,
      errors: results.errors.slice(0, 10) // Limit error details for large batches
    };
  } catch (error) {
    console.error(`Error processing job ${job.id}:`, error);
    throw error; // Will be caught by Bull and trigger a retry if configured
  }
});

console.log('User processing worker started');

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('Worker shutting down...');
  await userQueue.close();
  process.exit(0);
});