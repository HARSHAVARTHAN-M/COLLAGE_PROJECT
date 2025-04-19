// blockchain/scripts/deploy.js
import { createRequire } from "module";
const require = createRequire(import.meta.url);

// Load Hardhat Runtime Environment
const hre = require("hardhat");
const { ethers } = hre;

async function main() {
    console.log("📄 Deploying LibraryLog...");

    const LibraryLog = await ethers.getContractFactory("LibraryLog"); // This line fails if `ethers` is undefined
    const libraryLog = await LibraryLog.deploy();

    await libraryLog.waitForDeployment();
    const address = await libraryLog.getAddress();

    console.log("✅ LibraryLog deployed to:", address);
}

main().catch((error) => {
    console.error("❌ Deployment error:", error);
    process.exit(1);
});
