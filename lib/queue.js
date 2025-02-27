import Bull from 'bull';
import { processUser } from './worker';

export const addUserQueue = new Bull('addUserQueue', {
    redis: { host: '127.0.0.1', port: 6379 },
});

addUserQueue.process(processUser);
