import Queue from "bull";
import axios from "axios";

// Connect to Redis
const userQueue = new Queue("userQueue", {
  redis: { host: "127.0.0.1", port: 6379 },
});

console.log("🚀 Worker started, waiting for jobs...");

// Process the job queue
userQueue.process(async (job, done) => {
  try {
    console.log(`📌 Processing job: ${job.id}`, job.data);

    // Simulating API request to add users (Replace with actual API endpoint)
    const response = await axios.post("https://example.com/api/users", job.data);

    console.log(`✅ User added:`, response.data);
    done();
  } catch (error) {
    console.error(`❌ Job failed: ${error.message}`);
    done(error);
  }
});

// Handle job failures
userQueue.on("failed", (job, err) => {
  console.error(`❌ Job ${job.id} failed:`, err.message);
});
