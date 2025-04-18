const hre = require("hardhat");

async function main() {
  console.log("Deploying EComToken contract...");
  
  // Get the ContractFactory
  const EComToken = await hre.ethers.getContractFactory("EComToken");
  
  // Get the first account from the connected wallet
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  
  // Deploy the contract with the deployer address as initialOwner
  const ecomToken = await EComToken.deploy(deployer.address);
  
  // Wait for deployment to complete
  await ecomToken.waitForDeployment();
  
  const address = await ecomToken.getAddress();
  console.log("EComToken deployed to:", address);
  
  return address;
}

// Execute the deployment
main()
  .then((tokenAddress) => {
    console.log("Token deployment successful:", tokenAddress);
    process.exit(0);
  })
  .catch((error) => {
    console.error("Error during deployment:", error);
    process.exit(1);
  });