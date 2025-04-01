// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Snapshot.sol";

contract EComToken is ERC20, Ownable, Pausable, ERC20Burnable, ERC20Snapshot {
    uint256 public constant MAX_SUPPLY = 100_000_000 * 10**18; // 100M tokens
    uint256 public transactionFee = 25; // 0.25% (basis points)
    address public feeCollector;
    mapping(address => bool) public whitelistedMerchants;
    mapping(address => bool) public blacklisted;

    event MerchantWhitelisted(address indexed merchant);
    event BlacklistUpdated(address indexed account, bool status);
    event FeesCollected(address indexed from, uint256 amount);

    constructor(address initialOwner) 
        ERC20("ECommerce Global Token", "ECOM") 
        Ownable(initialOwner)
    {
        feeCollector = initialOwner;
        _mint(initialOwner, MAX_SUPPLY);
    }

    // Fee calculation modifier
    modifier deductFee(address sender, uint256 amount) {
        if (transactionFee > 0 && !whitelistedMerchants[sender]) {
            uint256 fee = (amount * transactionFee) / 10000;
            super._transfer(sender, feeCollector, fee);
            emit FeesCollected(sender, fee);
            amount -= fee;
        }
        _;
    }

    // Main transfer function with fee logic
    function _update(address from, address to, uint256 amount)
        internal
        override(ERC20, ERC20Snapshot)
        whenNotPaused
    {
        require(!blacklisted[from], "Sender blacklisted");
        require(!blacklisted[to], "Recipient blacklisted");
        super._update(from, to, amount);
    }

    // Merchant onboarding
    function whitelistMerchant(address merchant) external onlyOwner {
        whitelistedMerchants[merchant] = true;
        emit MerchantWhitelisted(merchant);
    }

    // Security features
    function setBlacklist(address account, bool status) external onlyOwner {
        blacklisted[account] = status;
        emit BlacklistUpdated(account, status);
    }

    function setTransactionFee(uint256 newFee) external onlyOwner {
        require(newFee <= 100, "Max fee 1%"); // 1% maximum
        transactionFee = newFee;
    }

    function setFeeCollector(address newCollector) external onlyOwner {
        require(newCollector != address(0), "Invalid address");
        feeCollector = newCollector;
    }

    // Emergency controls
    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    // Snapshot for governance
    function snapshot() external onlyOwner {
        _snapshot();
    }

    function decimals() public pure override returns (uint8) {
        return 18;
    }
}