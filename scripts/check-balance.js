// scripts/check-balance.js
const hre = require("hardhat");

async function main() {
  const [signer] = await hre.ethers.getSigners();
  console.log("Checking balance for:", signer.address);
  
  const balanceWei = await hre.ethers.provider.getBalance(signer.address);
  const balanceEth = hre.ethers.formatEther(balanceWei);
  
  console.log(`Balance: ${balanceEth} ETH`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});