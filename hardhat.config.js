require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.20",
  networks: {
    sepolia: {
      url: process.env.INFURA_URL,
      accounts: [process.env.PRIVATE_KEY]
    },
    mainnet: {
      url: `https://mainnet.infura.io/v3/${process.env.INFURA_PROJECT_ID || process.env.INFURA_URL.split('/').pop()}`,
      accounts: [process.env.PRIVATE_KEY],
      gasPrice: 30000000000 // 30 gwei
    }
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
  }
};