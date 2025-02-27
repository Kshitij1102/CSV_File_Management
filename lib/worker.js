import axios from 'axios';

export async function processUser(job) {
    try {
        const { name, email } = job.data;

        const response = await axios.post('https://your-external-api.com/addUser', { name, email });

        if (response.status === 201) {
            console.log(`User ${name} added successfully.`);
        } else {
            console.error(`Failed to add user ${name}: ${response.data.message}`);
        }
    } catch (error) {
        console.error(`Error adding user ${job.data.name}:`, error.message);
    }
}
