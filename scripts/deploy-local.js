const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const EComPlatform = await hre.ethers.getContractFactory("ECom");
  const ecomToken = await EComPlatform.deploy(deployer.address);

  const deploymentTx = ecomToken.deploymentTransaction();
  const receipt = await deploymentTx.wait();

  const address = await ecomToken.getAddress();
  console.log("EComCombined deployed to:", address);

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
  .then((addr) => {
    console.log("EComCombined deployment successful:", addr);
    process.exit(0);
  })
  .catch((error) => {
    console.error("Error during deployment:", error);
    process.exit(1);
  });