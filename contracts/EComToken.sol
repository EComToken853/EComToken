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
    {
        feeCollector = initialOwner;
        _mint(initialOwner, MAX_SUPPLY);
        // Transfer ownership to initialOwner
        transferOwnership(initialOwner);
    }
    
    // Override transfer to apply fee logic
    function transfer(address to, uint256 amount) public override returns (bool) {
        _checkFeeAndTransfer(_msgSender(), to, amount);
        return true;
    }
    
    // Override transferFrom to apply fee logic
    function transferFrom(address from, address to, uint256 amount) public override returns (bool) {
        address spender = _msgSender();
        _spendAllowance(from, spender, amount);
        _checkFeeAndTransfer(from, to, amount);
        return true;
    }
    
    // Internal function to handle fee logic and transfer
    function _checkFeeAndTransfer(address sender, address recipient, uint256 amount) internal {
        require(!blacklisted[sender], "Sender blacklisted");
        require(!blacklisted[recipient], "Recipient blacklisted");
        
        if (transactionFee > 0 && !whitelistedMerchants[sender]) {
            uint256 fee = (amount * transactionFee) / 10000;
            super._transfer(sender, feeCollector, fee);
            emit FeesCollected(sender, fee);
            super._transfer(sender, recipient, amount - fee);
        } else {
            super._transfer(sender, recipient, amount);
        }
    }
    
    // Override _beforeTokenTransfer to handle both ERC20 and ERC20Snapshot
    function _beforeTokenTransfer(address from, address to, uint256 amount)
        internal
        virtual
        override(ERC20, ERC20Snapshot)
        whenNotPaused
    {
        // Blacklist checks moved to _checkFeeAndTransfer for normal transfers
        // Still need them here for minting/burning
        if (from != address(0) && to != address(0)) {
            // Skip blacklist check for normal transfers as they're handled in _checkFeeAndTransfer
        } else {
            // For minting/burning operations
            if (from != address(0)) require(!blacklisted[from], "Sender blacklisted");
            if (to != address(0)) require(!blacklisted[to], "Recipient blacklisted");
        }
        super._beforeTokenTransfer(from, to, amount);
    }
    
    // Merchant onboarding
    function whitelistMerchant(address merchant) external onlyOwner {
        whitelistedMerchants[merchant] = true;
        emit MerchantWhitelisted(merchant);
    }
    
    // Remove merchant from whitelist
    function removeFromWhitelist(address merchant) external onlyOwner {
        whitelistedMerchants[merchant] = false;
        emit MerchantWhitelisted(merchant); // Consider a different event
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