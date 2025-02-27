import { Queue } from 'bull';
import axios from 'axios';

// Create a new queue instance
const userQueue = new Queue('userQueue', 'redis://127.0.0.1:6379');

// Process jobs from the queue
userQueue.process(async (job) => {
  const { name, email } = job.data;

  try {
    // Simulate an API request to add a user
    const response = await axios.post('https://api.example.com/users', { name, email });
    console.log(`User added: ${response.data}`);
  } catch (error) {
    console.error(`Failed to add user: ${error.message}`);
    throw error; // Retry the job if it fails
  }
});

// Log when a job is completed
userQueue.on('completed', (job) => {
  console.log(`Job ${job.id} completed`);
});

// Log when a job fails
userQueue.on('failed', (job, error) => {
  console.error(`Job ${job.id} failed: ${error.message}`);
});