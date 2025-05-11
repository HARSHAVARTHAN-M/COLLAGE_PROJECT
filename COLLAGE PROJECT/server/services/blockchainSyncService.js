import cron from 'node-cron';
import { blockchainService } from './blockchainService.js';

export const startBlockchainSync = () => {
    // Run every 5 minutes
    cron.schedule('*/5 * * * *', async () => {
        try {
            console.log('Starting blockchain sync...');
            const logs = await blockchainService.getAllLogs();
            console.log(`Synced ${logs.length} blockchain records`);
        } catch (error) {
            console.error('Blockchain sync error:', error);
        }
    });
};