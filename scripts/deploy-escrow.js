const hre = require("hardhat");

async function main() {
  // Get the token address from environment variable
  const tokenAddress = process.env.TOKEN_ADDRESS;
  
  if (!tokenAddress) {
    console.error("Please set the TOKEN_ADDRESS environment variable");
    process.exit(1);
  }
  
  console.log("Deploying EComEscrow contract...");
  console.log("Using token address:", tokenAddress);
  
  // Get the first account from the connected wallet
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  
  // Deploy the escrow contract
  const EComEscrow = await hre.ethers.getContractFactory("EComEscrow");
  const ecomEscrow = await EComEscrow.deploy(tokenAddress, deployer.address);
  
  console.log("Waiting for deployment transaction to be mined...");
  await ecomEscrow.waitForDeployment();
  
  const escrowAddress = await ecomEscrow.getAddress();
  console.log("EComEscrow deployed to:", escrowAddress);
  
  return escrowAddress;
}

main()
  .then((escrowAddress) => {
    console.log("Escrow deployment successful:", escrowAddress);
    process.exit(0);
  })
  .catch((error) => {
    console.error("Error during deployment:", error);
    process.exit(1);
  });