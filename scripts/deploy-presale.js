const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  // Get network information
  const network = hre.network.name;
  console.log(`\n=== Deploying to ${network.toUpperCase()} network ===\n`);
  
  // Determine Etherscan base URL based on network
  const etherscanBaseUrl = network === "mainnet" 
    ? "https://etherscan.io" 
    : `https://${network}.etherscan.io`;
  
  // Get deployer's address and balance
  const [deployer] = await ethers.getSigners();
  const deployerAddress = await deployer.getAddress();
  const deployerBalance = ethers.formatEther(await ethers.provider.getBalance(deployerAddress));
  
  console.log(`Deployer: ${deployerAddress}`);
  console.log(`Balance: ${deployerBalance} ETH\n`);
  
  // Get current gas price
  const gasPrice = await ethers.provider.getFeeData();
  const gasPriceGwei = ethers.formatUnits(gasPrice.gasPrice, "gwei");
  console.log(`Current Gas Price: ${gasPriceGwei} Gwei\n`);
  
  // Deploy EComToken contract
  console.log("Deploying EComToken...");
  const initialBalance = await ethers.provider.getBalance(deployerAddress);
  
  const EComToken = await ethers.getContractFactory("EComToken");
  const ecomToken = await EComToken.deploy(deployerAddress);
  const ecomTokenTx = await ecomToken.deploymentTransaction();
  await ecomToken.waitForDeployment();
  
  const receipt = await ethers.provider.getTransactionReceipt(ecomTokenTx.hash);
  const ecomGasUsed = receipt.gasUsed;
  const ecomEthCost = ecomGasUsed * gasPrice.gasPrice;
  
  const ecomTokenAddress = await ecomToken.getAddress();
  
  console.log(`\n✅ EComToken deployed at: ${ecomTokenAddress}`);
  console.log(`Transaction hash: ${ecomTokenTx.hash}`);
  console.log(`Gas used: ${ecomGasUsed.toString()} units`);
  console.log(`ETH cost: ${ethers.formatEther(ecomEthCost)} ETH`);
  console.log(`Verify: ${etherscanBaseUrl}/address/${ecomTokenAddress}\n`);
  
  // Define presale parameters
  const now = Math.floor(Date.now() / 1000);
  const ONE_DAY = 24 * 60 * 60;
  
  // MultiCoinPresale parameters
  const presaleParams = {
    token: ecomTokenAddress,
    ethRate: ethers.parseUnits("5000", 18), // 5000 tokens per ETH
    capUSD: ethers.parseUnits("100000", 18), // $100,000 cap
    maxContributionUSD: ethers.parseUnits("5000", 18), // $5,000 max per user
    startTime: now + ONE_DAY, // Starts 1 day from now
    endTime: now + 8 * ONE_DAY, // Ends 8 days from now
  };
  
  // Deploy presale contract
  console.log("Deploying MultiCoinPresale...");
  
  const MultiCoinPresale = await ethers.getContractFactory("MultiCoinPresale");
  const presale = await MultiCoinPresale.deploy(
    presaleParams.token,
    presaleParams.ethRate,
    presaleParams.capUSD,
    presaleParams.maxContributionUSD,
    presaleParams.startTime,
    presaleParams.endTime
  );
  
  const presaleTx = await presale.deploymentTransaction();
  await presale.waitForDeployment();
  
  const presaleReceipt = await ethers.provider.getTransactionReceipt(presaleTx.hash);
  const presaleGasUsed = presaleReceipt.gasUsed;
  const presaleEthCost = presaleGasUsed * gasPrice.gasPrice;
  
  const presaleAddress = await presale.getAddress();
  
  console.log(`\n✅ MultiCoinPresale deployed at: ${presaleAddress}`);
  console.log(`Transaction hash: ${presaleTx.hash}`);
  console.log(`Gas used: ${presaleGasUsed.toString()} units`);
  console.log(`ETH cost: ${ethers.formatEther(presaleEthCost)} ETH`);
  console.log(`Verify: ${etherscanBaseUrl}/address/${presaleAddress}\n`);
  
  // Add some popular stablecoins as payment options (examples)
  console.log("Adding payment tokens to presale...");
  
  // Example token addresses (use actual addresses for mainnet/testnet)
  const paymentTokens = {
    // Using placeholder addresses - replace with actual addresses for your target network
    USDT: "0xdAC17F958D2ee523a2206206994597C13D831ec7", // Mainnet USDT
    USDC: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // Mainnet USDC
    DAI: "0x6B175474E89094C44Da98b954EedeAC495271d0F"   // Mainnet DAI
  };
  
  // Add these tokens if we're on mainnet, otherwise skip
  let addTokensTx = [];
  if (network === "mainnet") {
    // Set rates - 1 USDT/USDC/DAI = X tokens (same as $1)
    const stablecoinRate = ethers.parseUnits("5", 18); // 5 tokens per 1 USD
    
    for (const [symbol, address] of Object.entries(paymentTokens)) {
      console.log(`Adding ${symbol} as payment token...`);
      const tx = await presale.addPaymentToken(address, stablecoinRate);
      await tx.wait();
      addTokensTx.push({
        symbol,
        address,
        rate: ethers.formatUnits(stablecoinRate, 18),
        txHash: tx.hash
      });
      console.log(`✅ Added ${symbol} with rate: ${ethers.formatUnits(stablecoinRate, 18)} tokens per 1 ${symbol}`);
    }
  } else {
    console.log("Skipping adding payment tokens on non-mainnet network");
  }
  
  // Transfer tokens to the presale contract
  console.log("Transferring tokens to the presale contract...");
  const tokensForPresale = ethers.parseUnits("500000", 18); // 500,000 tokens
  
  const transferTx = await ecomToken.transfer(presaleAddress, tokensForPresale);
  await transferTx.wait();
  
  const transferReceipt = await ethers.provider.getTransactionReceipt(transferTx.hash);
  const transferGasUsed = transferReceipt.gasUsed;
  const transferEthCost = transferGasUsed * gasPrice.gasPrice;
  
  console.log(`✅ Transferred ${ethers.formatUnits(tokensForPresale, 18)} tokens to the presale contract`);
  console.log(`Transaction hash: ${transferTx.hash}`);
  console.log(`Gas used: ${transferGasUsed.toString()} units`);
  console.log(`ETH cost: ${ethers.formatEther(transferEthCost)} ETH`);
  console.log(`Check tx: ${etherscanBaseUrl}/tx/${transferTx.hash}\n`);
  
  // Calculate total gas used and cost
  const totalGasUsed = ecomGasUsed + presaleGasUsed + transferGasUsed;
  const totalEthCost = ecomEthCost + presaleEthCost + transferEthCost;
  
  console.log(`Total gas used: ${totalGasUsed.toString()} units`);
  console.log(`Total ETH cost: ${ethers.formatEther(totalEthCost)} ETH`);
  
  // Format presale dates for readability
  const startDate = new Date(presaleParams.startTime * 1000).toLocaleString();
  const endDate = new Date(presaleParams.endTime * 1000).toLocaleString();
  console.log(`Presale starts: ${startDate}`);
  console.log(`Presale ends: ${endDate}\n`);
  
  // Save deployment information
  const deploymentInfo = {
    network,
    deployer: deployerAddress,
    gasPrice: {
      gwei: gasPriceGwei,
      wei: gasPrice.gasPrice.toString()
    },
    ecomToken: {
      address: ecomTokenAddress,
      txHash: ecomTokenTx.hash,
      gasUsed: ecomGasUsed.toString(),
      ethCost: ethers.formatEther(ecomEthCost),
      etherscanLink: `${etherscanBaseUrl}/address/${ecomTokenAddress}`
    },
    presale: {
      address: presaleAddress,
      txHash: presaleTx.hash,
      gasUsed: presaleGasUsed.toString(),
      ethCost: ethers.formatEther(presaleEthCost),
      type: "MultiCoinPresale",
      ethRate: ethers.formatUnits(presaleParams.ethRate, 18),
      capUSD: ethers.formatUnits(presaleParams.capUSD, 18),
      maxContributionUSD: ethers.formatUnits(presaleParams.maxContributionUSD, 18),
      startTime: presaleParams.startTime,
      startDate,
      endTime: presaleParams.endTime,
      endDate,
      etherscanLink: `${etherscanBaseUrl}/address/${presaleAddress}`,
      paymentTokens: addTokensTx
    },
    tokenTransfer: {
      txHash: transferTx.hash,
      gasUsed: transferGasUsed.toString(),
      ethCost: ethers.formatEther(transferEthCost),
      amount: ethers.formatUnits(tokensForPresale, 18)
    },
    totals: {
      gasUsed: totalGasUsed.toString(),
      ethCost: ethers.formatEther(totalEthCost)
    },
    timestamp: new Date().toISOString()
  };
  
  // Save to file
  const deploymentPath = path.join(__dirname, `../deployments`);
  if (!fs.existsSync(deploymentPath)) {
    fs.mkdirSync(deploymentPath, { recursive: true });
  }
  
  const filePath = path.join(deploymentPath, `deployment-${network}-${Date.now()}.json`);
  fs.writeFileSync(filePath, JSON.stringify(deploymentInfo, null, 2));
  console.log(`Deployment info saved to: ${filePath}`);
  
  console.log("\n=== DEPLOYMENT COMPLETE ===\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });