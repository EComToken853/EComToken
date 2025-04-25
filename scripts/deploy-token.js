const hre = require("hardhat");

async function main() {
  console.log("Deploying EComToken contract...");
  
  const EComToken = await hre.ethers.getContractFactory("EComPlatform"); // Make sure name matches your contract

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Optional: print balance
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Deployer balance:", hre.ethers.formatEther(balance), "ETH");

  const ecomToken = await EComToken.deploy(deployer.address);
  await ecomToken.waitForDeployment();

  const address = await ecomToken.getAddress();
  console.log("EComToken deployed to:", address);

  return address;
}

main()
  .then((tokenAddress) => {
    console.log("Token deployment successful:", tokenAddress);
    process.exit(0);
  })
  .catch((error) => {
    console.error("Error during deployment:", error);
    process.exit(1);
  });
