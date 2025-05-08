const hre = require("hardhat");

async function main() {
  console.log("Deploying EComToken contract...");

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with:", deployer.address);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Deployer balance:", hre.ethers.formatEther(balance), "ETH");

  const EComToken = await hre.ethers.getContractFactory("EComToken");
  const ecomToken = await EComToken.deploy(deployer.address);

  const deployTx = ecomToken.deploymentTransaction();
  console.log("Deployment TX sent. Tx Hash:", deployTx.hash);

  await ecomToken.waitForDeployment(); // Wait for contract to be deployed

  const receipt = await hre.ethers.provider.getTransactionReceipt(deployTx.hash);
  if (!receipt) {
    throw new Error("Transaction receipt not found or failed");
  }

  const address = await ecomToken.getAddress();
  console.log("EComToken deployed to:", address);

  console.log("Raw receipt values:");
  console.log("  gasUsed:", receipt.gasUsed.toString());

  const fullTx = await hre.ethers.provider.getTransaction(deployTx.hash);
  console.log("  gasPrice:", fullTx.gasPrice.toString());

  const gasUsed = BigInt(receipt.gasUsed);
  const gasPrice = BigInt(fullTx.gasPrice);
  const totalFee = gasUsed * gasPrice;

  console.log("Gas used for deployment:", gasUsed.toString());
  console.log("Total fee in wei:", totalFee.toString());
  console.log("Total fee in ETH:", hre.ethers.formatEther(totalFee));

  console.log(`Contract deployed successfully! View at: https://sepolia.etherscan.io/address/${address}`);
  return address;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error during deployment:", error);
    process.exit(1);
  });
