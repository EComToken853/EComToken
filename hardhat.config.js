require("@nomicfoundation/hardhat-toolbox");
// Remove any duplicate plugin imports
require("dotenv").config();

module.exports = {
  solidity: "0.8.24",
  networks: { /* ... */ },
  etherscan: {
    apiKey: process.env.ETHERSCAN_KEY
  }
};