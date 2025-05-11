import { exec, spawn } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import dotenv from 'dotenv';

const CONFIG_PATH = 'd:/COLLAGE_PROJECT/server/config/config.env';

async function updateEnvFile(contractAddress) {
    try {
        const envContent = await fs.readFile(CONFIG_PATH, 'utf-8');
        const updatedContent = envContent.replace(
            /LIBRARY_LOG_CONTRACT_ADDRESS=.*/,
            `LIBRARY_LOG_CONTRACT_ADDRESS=${contractAddress}`
        );
        await fs.writeFile(CONFIG_PATH, updatedContent);
        console.log('Updated contract address in config.env');
    } catch (error) {
        console.error('Error updating config.env:', error);
    }
}

async function compileContracts() {
    return new Promise((resolve, reject) => {
        console.log('Compiling contracts...');
        const compilation = exec('npx hardhat compile');
        
        compilation.stdout.on('data', (data) => {
            console.log(data);
        });

        compilation.on('close', (code) => {
            if (code === 0) {
                console.log('Compilation successful');
                resolve();
            } else {
                reject(new Error('Compilation failed'));
            }
        });
    });
}

async function killExistingNode() {
    return new Promise((resolve) => {
        exec('netstat -ano | findstr :8545', (error, stdout) => {
            if (stdout) {
                const lines = stdout.toString().split('\n');
                lines.forEach(line => {
                    const match = line.match(/LISTENING\s+(\d+)/);
                    if (match && match[1]) {
                        const pid = match[1];
                        exec(`taskkill /F /PID ${pid}`, (err) => {
                            if (err) {
                                console.log(`Process ${pid} already terminated`);
                            } else {
                                console.log(`Killed process ${pid}`);
                            }
                        });
                    }
                });
            }
            // Give it a moment to kill the process
            setTimeout(resolve, 2000);
        });
    });
}

async function startHardhatNode() {
    return new Promise(async (resolve, reject) => {
        console.log('Checking for existing Hardhat node...');
        await killExistingNode();
        
        console.log('Starting Hardhat node...');
        const hardhatNode = spawn('npx.cmd', ['hardhat', 'node'], {
            shell: true,
            stdio: 'pipe',
            cwd: process.cwd()
        });

        let isStarted = false;

        hardhatNode.stdout.on('data', (data) => {
            const output = data.toString();
            
            if (output.includes('Started HTTP and WebSocket JSON-RPC server') && !isStarted) {
                console.log('\x1b[32m%s\x1b[0m', '🚀 Hardhat node is running');
                isStarted = true;
                setTimeout(resolve, 2000);
            }
        });

        hardhatNode.stderr.on('data', async (data) => {
            console.error('\x1b[31m%s\x1b[0m', data.toString());
            if (data.toString().includes('EADDRINUSE') && !isStarted) {
                console.log('Port still in use, killing process...');
                await killExistingNode();
                setTimeout(() => {
                    startHardhatNode().then(resolve).catch(reject);
                }, 2000);
            }
        });

        hardhatNode.on('error', (error) => {
            if (!isStarted) {
                console.error('Failed to start node:', error);
                reject(error);
            }
        });

        process.on('SIGINT', () => {
            hardhatNode.kill();
            process.exit();
        });
    });
}

async function deployContract() {
    return new Promise((resolve, reject) => {
        console.log('\n📄 Deploying contract...');
        const deployment = exec('npx hardhat run blockchain/scripts/deploy.js --network localhost');
        
        deployment.stdout.on('data', (data) => {
            console.log('\x1b[33m%s\x1b[0m', data.toString().trim());
            if (data.includes('LibraryLog deployed to:')) {
                const address = data.split('LibraryLog deployed to:')[1].trim();
                resolve(address);
            }
        });

        deployment.stderr.on('data', (data) => {
            console.error('\x1b[31m%s\x1b[0m', `Deployment error: ${data}`);
            reject(data);
        });
    });
}

async function main() {
    try {
        await compileContracts();
        await startHardhatNode();
        const contractAddress = await deployContract();
        await updateEnvFile(contractAddress);
        console.log('Blockchain setup complete!');
        
        console.log('\nPress Ctrl+C to stop the Hardhat node and exit');
    } catch (error) {
        console.error('Setup failed:', error);
        process.exit(1);
    }
}

main();