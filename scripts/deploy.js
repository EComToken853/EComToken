async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with account:", deployer.address);
  
    const EComToken = await ethers.getContractFactory("EComToken");
    const token = await EComToken.deploy();
    
    console.log("Token deployed to:", await token.getAddress());
    console.log("Deployer balance:", (await token.balanceOf(deployer.address)).toString());
  }
  
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });