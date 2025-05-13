const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("EComToken", function () {
  let token;
  let owner, merchant, user;

  beforeEach(async () => {
    [owner, merchant, user] = await ethers.getSigners();
    const EComToken = await ethers.getContractFactory("EComToken");
    token = await EComToken.deploy(owner.address);
    await token.waitForDeployment();
  });

  it("Should deploy with correct parameters", async () => {
    expect(await token.name()).to.equal("ECommerce Global Token");
    expect(await token.symbol()).to.equal("ECOM");

    const totalSupply = ethers.parseUnits("100000000", 18);
    expect(await token.totalSupply()).to.equal(totalSupply);
    expect(await token.balanceOf(owner.address)).to.equal(totalSupply);
  });

  it("Should handle fee calculations correctly", async () => {
    await token.setTransactionFee(100); // 1%

    const initialBalance = await token.balanceOf(owner.address);

    await token.transfer(user.address, 1000);

    const finalBalance = await token.balanceOf(owner.address);

    expect(finalBalance).to.equal(initialBalance - 1000n + 10n);
  });

  it("Should prevent blacklisted addresses", async () => {
    await token.setBlacklist(user.address, true);

    await expect(
      token.connect(user).transfer(owner.address, 100)
    ).to.be.revertedWithCustomError(token, "Blacklisted");
  });

  it("Should allow merchant whitelisting", async () => {
    await token.whitelistMerchant(merchant.address);
    expect(await token.whitelistedMerchants(merchant.address)).to.be.true;
  });

  it("Should have correct name and symbol", async () => {
    expect(await token.name()).to.equal("ECommerce Global Token");
    expect(await token.symbol()).to.equal("ECOM");
  });
});
