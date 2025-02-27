import Queue from 'better-queue';
import EventEmitter from 'events';

// Store jobs in memory
const jobStore = new Map();
const jobEmitter = new EventEmitter();

// Store for queues
const queues = {};

/**
 * Create or get an in-memory queue
 * @param {string} name - Queue name
 * @returns {Queue} - Queue instance
 */
export function createQueue(name) {
  if (!queues[name]) {
    queues[name] = new Queue(async (task, callback) => {
      try {
        // Process the task
        const { taskType, data } = task;
        
        // Update job state
        const job = jobStore.get(task.id);
        if (job) {
          job.state = 'active';
          job.startedAt = new Date();
          jobEmitter.emit(`job.update.${task.id}`, job);
        }
        
        // Execute the handler
        const result = await taskHandlers[name][taskType](data, (progress) => {
          // Update progress
          if (job) {
            job.progress = progress;
            jobEmitter.emit(`job.update.${task.id}`, job);
          }
        });
        
        // Mark as completed
        if (job) {
          job.state = 'completed';
          job.completedAt = new Date();
          job.result = result;
          jobEmitter.emit(`job.update.${task.id}`, job);
        }
        
        callback(null, result);
      } catch (error) {
        console.error(`Error processing task in queue ${name}:`, error);
        
        // Mark as failed
        const job = jobStore.get(task.id);
        if (job) {
          job.state = 'failed';
          job.error = error.message;
          jobEmitter.emit(`job.update.${task.id}`, job);
        }
        
        callback(error);
      }
    }, {
      concurrent: 5, // Process up to 5 jobs concurrently
      maxRetries: 3,
      retryDelay: 1000
    });
    
    console.log(`Queue ${name} created`);
  }
  
  return queues[name];
}

// Store for task handlers
const taskHandlers = {};

/**
 * Register a handler for a specific task type
 * @param {string} queueName - Queue name
 * @param {string} taskType - Task type
 * @param {function} handler - Handler function
 */
export function registerTaskHandler(queueName, taskType, handler) {
  if (!taskHandlers[queueName]) {
    taskHandlers[queueName] = {};
  }
  
  taskHandlers[queueName][taskType] = handler;
  console.log(`Handler registered for ${queueName}.${taskType}`);
}

/**
 * Add a job to the queue
 * @param {string} queueName - Queue name
 * @param {string} taskType - Task type
 * @param {object} data - Job data
 * @returns {Promise<object>} - Job object
 */
export async function addJob(queueName, taskType, data) {
  const queue = createQueue(queueName);
  
  return new Promise((resolve, reject) => {
    // Generate a unique ID
    const id = `job_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
    
    // Create job object
    const job = {
      id,
      state: 'waiting',
      taskType,
      data,
      progress: 0,
      createdAt: new Date(),
      result: null,
      error: null
    };
    
    // Store the job
    jobStore.set(id, job);
    
    // Add to queue
    queue.push({ id, taskType, data }, (err, result) => {
      if (err) {
        console.error(`Job ${id} failed:`, err);
      } else {
        console.log(`Job ${id} completed successfully`);
      }
    });
    
    resolve(job);
  });
}

/**
 * Get job status
 * @param {string} jobId - Job ID
 * @returns {Promise<object>} - Job status
 */
export async function getJobStatus(jobId) {
  const job = jobStore.get(jobId);
  
  if (!job) {
    throw new Error('Job not found');
  }
  
  return {
    id: job.id,
    state: job.state,
    progress: job.progress,
    createdAt: job.createdAt,
    startedAt: job.startedAt,
    completedAt: job.completedAt,
    error: job.error,
    result: job.result,
    fileName: job.data.fileName,
    totalRecords: job.data.records.length,
    isCompleted: job.state === 'completed',
    isFailed: job.state === 'failed'
  };
}

/**
 * Wait for job updates
 * @param {string} jobId - Job ID
 * @param {function} callback - Callback function
 * @returns {function} - Function to stop listening
 */
export function onJobUpdate(jobId, callback) {
  const eventName = `job.update.${jobId}`;
  jobEmitter.on(eventName, callback);
  
  return () => {
    jobEmitter.off(eventName, callback);
  };
}