const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("EComToken", function () {
  let token;
  let owner, merchant, user;

  before(async () => {
    [owner, merchant, user] = await ethers.getSigners();
    const EComToken = await ethers.getContractFactory("EComToken");
    token = await EComToken.deploy(owner.address);
  });

  it("Should deploy with correct parameters", async () => {
    expect(await token.name()).to.equal("ECommerce Global Token");
    expect(await token.symbol()).to.equal("ECOM");
    expect(await token.totalSupply()).to.equal(100_000_000n * 10n**18n);
  });

  it("Should handle fee calculations correctly", async () => {
    await token.setTransactionFee(100); // 1%
    const initialBalance = await token.balanceOf(owner.address);
    
    await token.transfer(user.address, 1000);
    const finalBalance = await token.balanceOf(owner.address);
    
    expect(finalBalance).to.equal(initialBalance - 1000n + 10n); // 1% fee
  });

  it("Should prevent blacklisted addresses", async () => {
    await token.setBlacklist(user.address, true);
    await expect(token.connect(user).transfer(owner.address, 100))
      .to.be.revertedWith("Sender blacklisted");
  });

  it("Should allow merchant whitelisting", async () => {
    await token.whitelistMerchant(merchant.address);
    expect(await token.whitelistedMerchants(merchant.address)).to.be.true;
  });
});