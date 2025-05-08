const hre = require("hardhat");

async function main() {
  console.log("Deploying EComToken contract...");

  const EComToken = await hre.ethers.getContractFactory("EComToken");

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Deployer balance:", hre.ethers.formatEther(balance), "ETH");

  const ecomToken = await EComToken.deploy(deployer.address);

  const deploymentTx = ecomToken.deploymentTransaction();
  const receipt = await deploymentTx.wait();

  const address = await ecomToken.getAddress();
  console.log("EComToken deployed to:", address);

  console.log("Raw receipt values:");
  console.log("  gasUsed:", receipt.gasUsed);
  console.log("  gasPrice (from tx):", deploymentTx.gasPrice);

  const gasUsed = BigInt(receipt.gasUsed);
  const gasPrice = BigInt(deploymentTx.gasPrice);
  const totalFee = gasUsed * gasPrice;

  console.log("Gas used for deployment:", gasUsed.toString());
  console.log("Total fee in wei:", totalFee.toString());
  console.log("Total fee in ETH:", hre.ethers.formatEther(totalFee));

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
