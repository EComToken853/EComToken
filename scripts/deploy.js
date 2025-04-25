const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const EComPlatform = await hre.ethers.getContractFactory("EComCombined");
  const ecomToken = await EComPlatform.deploy(deployer.address);

  console.log("Waiting for deployment transaction to be mined...");
  await ecomToken.waitForDeployment();

  const address = await ecomToken.getAddress();
  console.log("EComCombined deployed to:", address);

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
