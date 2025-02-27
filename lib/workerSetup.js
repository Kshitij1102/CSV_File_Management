import { registerTaskHandler } from './jobQueue';
import { batchAddUsers } from './userApi';

// Register the user processing handler
export function setupWorkers() {
  registerTaskHandler('user-processing', 'process-users', async (data, updateProgress) => {
    const { records } = data;
    
    console.log(`Starting to process ${records.length} users`);
    
    try {
      // Batch add users with progress updates
      const results = await batchAddUsers(records, (progress) => {
        updateProgress(progress);
      });
      
      // Log results
      console.log(`Processed ${results.successful} out of ${results.total} users`);
      
      // Return results
      return {
        processed: results.successful,
        failed: results.failed,
        total: results.total,
        errors: results.errors.slice(0, 10) // Limit error details for large batches
      };
    } catch (error) {
      console.error(`Error processing users:`, error);
      throw error;
    }
  });
  
  console.log('Worker handlers registered');
}