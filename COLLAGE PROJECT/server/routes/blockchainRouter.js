import express from 'express';
import { blockchainService } from '../services/blockchainService.js';
import { catchAsyncErrors } from '../middlewares/catchAsyncErrors.js';
import { isAuthenticated, isAuthorized } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get(
    '/logs',
    isAuthenticated,
    isAuthorized('Admin'),
    catchAsyncErrors(async (req, res) => {
        const logs = await blockchainService.getAllLogs();
        res.status(200).json({
            success: true,
            logs
        });
    })
);

export default router;