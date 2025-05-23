// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Snapshot.sol";

error Blacklisted(address user);
error InvalidAddress();
error FeeTooHigh();
error AmountLessThanFee();

contract EComToken is ERC20, Ownable, Pausable, ERC20Burnable, ERC20Snapshot {
    uint256 public transactionFee = 100; // 1% (in basis points)
    address public immutable feeCollector;
    
    mapping(address => bool) public whitelistedMerchants;
    mapping(address => bool) public blacklisted;
    
    mapping(address => uint256) public lastSnapshotTime;
    uint256 public snapshotCooldown = 10 minutes;
    
    bool public mintingFinalized;
    
    event MerchantWhitelisted(address indexed merchant);
    event MerchantRemoved(address indexed merchant);
    event BlacklistUpdated(address indexed account, bool status);
    event FeesCollected(address indexed from, address indexed to, uint256 amount);
    event TokensMinted(address indexed to, uint256 amount);
    event MintingFinalized();
    event TransactionFeeUpdated(uint256 oldFee, uint256 newFee);
    
    constructor(address initialOwner)
        ERC20("ECommerce Global Token", "ECOM")
    {
        if (initialOwner == address(0)) revert InvalidAddress();
        feeCollector = initialOwner;
        _mint(initialOwner, 100_000_000 * 10 ** decimals());
        transferOwnership(initialOwner);
    }
    
    function transfer(address to, uint256 amount) public override returns (bool) {
        _checkFeeAndTransfer(_msgSender(), to, amount);
        return true;
    }
    
    function transferFrom(address from, address to, uint256 amount) public override returns (bool) {
        address spender = _msgSender();
        _spendAllowance(from, spender, amount);
        _checkFeeAndTransfer(from, to, amount);
        return true;
    }
    
    function _checkFeeAndTransfer(address sender, address recipient, uint256 amount) internal {
        if (blacklisted[sender]) revert Blacklisted(sender);
        if (blacklisted[recipient]) revert Blacklisted(recipient);
        
        uint256 _fee = transactionFee;
        uint256 feeAmount;
        
        if (_fee > 0 && !whitelistedMerchants[sender]) {
            feeAmount = (amount * _fee) / 10000;
            if (amount <= feeAmount) revert AmountLessThanFee();
            super._transfer(sender, feeCollector, feeAmount);
            emit FeesCollected(sender, feeCollector, feeAmount);
        }
        
        super._transfer(sender, recipient, amount - feeAmount);
    }
    
    function _beforeTokenTransfer(address from, address to, uint256 amount)
        internal
        virtual
        override(ERC20, ERC20Snapshot)
        whenNotPaused
    {
        if (from == address(0)) {
            if (blacklisted[to]) revert Blacklisted(to);
        } else if (to == address(0)) {
            if (blacklisted[from]) revert Blacklisted(from);
        }
        
        super._beforeTokenTransfer(from, to, amount);
    }
    
    function whitelistMerchant(address merchant) external onlyOwner {
        if (merchant == address(0)) revert InvalidAddress();
        whitelistedMerchants[merchant] = true;
        emit MerchantWhitelisted(merchant);
    }
    
    function removeFromWhitelist(address merchant) external onlyOwner {
        whitelistedMerchants[merchant] = false;
        emit MerchantRemoved(merchant);
    }
    
    function setBlacklist(address account, bool status) external onlyOwner {
        if (account == feeCollector) revert InvalidAddress();
        blacklisted[account] = status;
        emit BlacklistUpdated(account, status);
    }
    
    function setTransactionFee(uint256 newFee) external onlyOwner {
        if (newFee > 100) revert FeeTooHigh();
        uint256 oldFee = transactionFee;
        transactionFee = newFee;
        emit TransactionFeeUpdated(oldFee, newFee);
    }
    
    function pause() external onlyOwner {
        _pause();
    }
    
    function unpause() external onlyOwner {
        _unpause();
    }
    
    function snapshot() external onlyOwner {
        require(
            block.timestamp > lastSnapshotTime[msg.sender] + snapshotCooldown,
            "Snapshot cooldown active"
        );
        lastSnapshotTime[msg.sender] = block.timestamp;
        _snapshot();
    }
    
    function decimals() public pure override returns (uint8) {
        return 18;
    }
    
    function mint(address to, uint256 amount) external onlyOwner {
        require(!mintingFinalized, "Minting has been permanently disabled");
        _mint(to, amount);
        emit TokensMinted(to, amount);
    }
    
    function finalizeMinting() external onlyOwner {
        mintingFinalized = true;
        emit MintingFinalized();
    }
}
