import { ethers } from 'ethers';
import { createRequire } from 'module';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import fs from 'fs';
import { Transaction } from '../models/transactionModel.js'; // Ensure you have a Transaction model

// Setup __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', 'config', 'config.env') });

// Debug: Check the private key
console.log('Private Key:', process.env.BLOCKCHAIN_PRIVATE_KEY);

// Load contract artifact
const artifactPath = path.join(__dirname, '..', 'blockchain', 'artifacts', 'blockchain', 'contracts', 'LibraryLog.sol', 'LibraryLog.json');

// Check if artifact file exists
if (!fs.existsSync(artifactPath)) {
    console.error('❌ Contract artifact not found at:', artifactPath);
    console.error('Please run: npx hardhat compile');
    process.exit(1);
}

// Load the contract JSON using require
const require = createRequire(import.meta.url);
const LibraryLog = require(artifactPath);

// Debug: Check if ABI is present
if (!LibraryLog.abi) {
    console.error('❌ ABI not found in contract artifact. Check compilation.');
    process.exit(1);
}

// Save Transaction function
async function saveTransaction(userId, bookId, transactionHash, blockNumber, action) {
    try {
        if (!transactionHash) {
            throw new Error('Transaction Hash is missing!');
        }

        const transaction = new Transaction({
            userId,
            bookId,
            transactionHash,  // Ensure transactionHash is passed here
            blockNumber,
            action
        });
        await transaction.save();
        console.log('Transaction saved successfully.');
    } catch (error) {
        console.error('Error saving transaction:', error);
    }
}

class BlockchainService {
    constructor() {
        if (
            !process.env.BLOCKCHAIN_PRIVATE_KEY ||
            !process.env.BLOCKCHAIN_PRIVATE_KEY.startsWith('0x') ||
            process.env.BLOCKCHAIN_PRIVATE_KEY.length !== 66
        ) {
            console.error('❌ Invalid private key. Please check your .env file.');
            process.exit(1);
        }

        this.provider = new ethers.JsonRpcProvider(process.env.BLOCKCHAIN_RPC_URL);
        this.signer = new ethers.Wallet(process.env.BLOCKCHAIN_PRIVATE_KEY, this.provider);
        this.contract = null;
        this.initialize();
    }

    async initialize() {
        try {
            this.contract = new ethers.Contract(
                process.env.LIBRARY_LOG_CONTRACT_ADDRESS,
                LibraryLog.abi,
                this.signer
            );
            console.log('✅ Blockchain contract initialized');
        } catch (error) {
            console.error('❌ Blockchain initialization error:', error);
        }
    }

    async recordAction(userId, bookId, action) {
        try {
            const validBookId = BigInt(`0x${bookId}`); // Assuming bookId is a hexadecimal string

            // Send transaction to the blockchain
            const tx = await this.contract.recordAction(validBookId, action === 'BORROW' ? 0 : 1);
            console.log('Transaction sent, awaiting confirmation...');

            // Wait for the transaction to be mined
            const receipt = await tx.wait();

            // Debugging: Log the entire receipt to check for transactionHash
            console.log('Transaction Receipt:', receipt);

            // Use receipt.hash instead of receipt.transactionHash
            const transactionHash = receipt.hash;

            if (!transactionHash) {
                console.error('❌ Transaction hash is missing!');
                throw new Error('Transaction hash is missing!');
            }

            console.log('Transaction Hash:', transactionHash);

            // Save transaction details in MongoDB
            await saveTransaction(
                userId,
                bookId,
                transactionHash, // Pass transactionHash here
                receipt.blockNumber,
                action
            );

            return true;
        } catch (error) {
            console.error('❌ Blockchain record error:', error);
            return false;
        }
    }

    async getAllLogs() {
        try {
            const logs = await this.contract.getAllLogs();
            return logs.map(log => ({
                bookId: log.bookId.toString(),
                action: log.action === 0 ? 'BORROW' : 'RETURN',
                timestamp: new Date(Number(log.timestamp) * 1000),
                user: log.user
            }));
        } catch (error) {
            console.error('❌ Error fetching logs:', error);
            return [];
        }
    }

    async addBookToBlockchain(bookId, title, quantity) {
        try {
            const validBookId = BigInt(`0x${bookId}`);
            
            // Send transaction to the blockchain
            const tx = await this.contract.addBook(validBookId, title, quantity);
            console.log('Transaction sent, awaiting confirmation...');

            // Wait for the transaction to be mined
            const receipt = await tx.wait();
            console.log('Transaction Receipt:', receipt);

            return true;
        } catch (error) {
            console.error('❌ Blockchain add book error:', error);
            return false;
        }
    }
}

export const blockchainService = new BlockchainService();
