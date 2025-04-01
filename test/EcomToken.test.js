const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("EComToken", function () {
  let token;
  let deployer;

  beforeEach(async () => {
    [deployer] = await ethers.getSigners();
    const EComToken = await ethers.getContractFactory("EComToken");
    token = await EComToken.deploy();
  });

  it("Should have correct name and symbol", async () => {
    expect(await token.name()).to.equal("ECom Token");
    expect(await token.symbol()).to.equal("ECOM");
  });

  it("Should mint initial supply to deployer", async () => {
    const totalSupply = await token.totalSupply();
    expect(await token.balanceOf(deployer.address)).to.equal(totalSupply);
  });
});