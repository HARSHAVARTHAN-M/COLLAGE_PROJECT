import hardhat from "hardhat";
import fs from "fs";
import path from "path";

const { ethers } = hardhat;

async function main() {
    console.log("📄 Deploying LibraryLog...");

    const LibraryLog = await ethers.getContractFactory("LibraryLog");
    const libraryLog = await LibraryLog.deploy();

    await libraryLog.waitForDeployment();
    const address = await libraryLog.getAddress();

    console.log("✅ LibraryLog deployed to:", address);

    // Update the environment file with the new contract address
    updateEnvFile(address);
}

function updateEnvFile(contractAddress) {
    const envPath = path.join(__dirname, "..", "config", "config.env");
    const envContent = fs.readFileSync(envPath, "utf-8");
    const updatedContent = envContent.replace(
        /LIBRARY_LOG_CONTRACT_ADDRESS=.*/,
        `LIBRARY_LOG_CONTRACT_ADDRESS=${contractAddress}`
    );
    fs.writeFileSync(envPath, updatedContent);
    console.log("🔄 Updated contract address in config.env");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("❌ Deployment error:", error);
        process.exit(1);
    });
