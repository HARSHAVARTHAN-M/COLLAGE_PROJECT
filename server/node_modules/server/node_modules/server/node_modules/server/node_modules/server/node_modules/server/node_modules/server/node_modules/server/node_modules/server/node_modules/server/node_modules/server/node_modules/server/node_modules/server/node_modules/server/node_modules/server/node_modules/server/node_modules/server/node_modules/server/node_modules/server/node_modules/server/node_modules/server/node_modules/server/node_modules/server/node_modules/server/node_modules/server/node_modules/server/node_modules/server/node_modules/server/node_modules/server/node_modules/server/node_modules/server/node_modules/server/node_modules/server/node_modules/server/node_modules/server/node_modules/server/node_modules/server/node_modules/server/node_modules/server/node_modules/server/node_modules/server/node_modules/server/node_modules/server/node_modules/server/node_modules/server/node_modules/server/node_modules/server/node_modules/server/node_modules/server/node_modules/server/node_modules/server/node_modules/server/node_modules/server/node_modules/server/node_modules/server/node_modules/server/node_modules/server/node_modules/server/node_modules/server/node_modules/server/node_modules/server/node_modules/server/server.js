import { app } from "./app.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";
import { ethers } from "ethers";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname } from "path";

dotenv.config();

// Setup __dirname for ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// -------------------------------
// ✅ Cloudinary Config
// -------------------------------
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLIENT_NAME,
  api_key: process.env.CLOUDINARY_CLIENT_API,
  api_secret: process.env.CLOUDINARY_CLIENT_SECRET,
});

// -------------------------------
// ✅ Load Blockchain Contract
// -------------------------------

// Automatically fetch the latest artifact file
// Directly specify the path to the artifact file
const contractArtifactPath = path.join(__dirname, "blockchain", "artifacts", "blockchain", "contracts", "LibraryLog.sol", "LibraryLog.json");

if (!fs.existsSync(contractArtifactPath)) {
  console.error("❌ Contract artifact not found. Did you run `npx hardhat compile`?");
  process.exit(1);
}

const LibraryLogArtifact = JSON.parse(fs.readFileSync(contractArtifactPath, "utf8"));

// Debug: Check if ABI is loaded
if (!LibraryLogArtifact.abi) {
  console.error("❌ ABI not found in contract artifact. Check compilation.");
  process.exit(1);
}

// -------------------------------
// ✅ Ethers Setup
// -------------------------------

const provider = new ethers.JsonRpcProvider(process.env.BLOCKCHAIN_RPC_URL);

const signer = new ethers.Wallet(process.env.BLOCKCHAIN_PRIVATE_KEY, provider);

const libraryLogContract = new ethers.Contract(
  process.env.LIBRARY_LOG_CONTRACT_ADDRESS,
  LibraryLogArtifact.abi, // Ensure ABI is correctly passed
  signer
);

// Export for use in routes/controllers
export { libraryLogContract };

// -------------------------------
// ✅ Start Express Server
// -------------------------------

app.listen(process.env.PORT || 4000, () => {
  console.log(`🚀 Server running on port ${process.env.PORT || 4000}`);
});
