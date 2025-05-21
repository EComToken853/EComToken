// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Snapshot.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract EComCombined is ERC20, Ownable, Pausable, ERC20Burnable, ERC20Snapshot, ReentrancyGuard {
    uint256 public constant MAX_SUPPLY = 100_000_000 * 10**18;
    uint256 public transactionFee = 25; // 0.25% in basis points
    address public feeCollector;

    mapping(address => bool) public whitelistedMerchants;
    mapping(address => bool) public blacklisted;

    event MerchantWhitelisted(address indexed merchant);
    event MerchantRemovedFromWhitelist(address indexed merchant);
    event BlacklistUpdated(address indexed account, bool status);
    event FeesCollected(address indexed from, uint256 amount);

    enum OrderStatus { Created, Shipped, Completed, Disputed, Refunded, Canceled }

    struct Order {
        address buyer;
        address seller;
        uint256 amount;
        uint256 createdAt;
        OrderStatus status;
        string orderReference;
        string disputeReason;
    }

    mapping(uint256 => Order) public orders;
    uint256 public nextOrderId = 1;
    uint256 public escrowPeriod = 14 days;
    uint256 public disputePeriod = 30 days;
    address public arbitrator;

    event OrderCreated(uint256 indexed orderId, address indexed buyer, address indexed seller, uint256 amount, string orderReference);
    event OrderShipped(uint256 indexed orderId);
    event OrderCompleted(uint256 indexed orderId);
    event OrderDisputed(uint256 indexed orderId, string reason);
    event DisputeResolved(uint256 indexed orderId, address winner);
    event OrderRefunded(uint256 indexed orderId);
    event OrderCanceled(uint256 indexed orderId);

    constructor(address initialOwner)
        ERC20("ECommerce Global Token", "ECOM")
    {
        feeCollector = initialOwner;
        arbitrator = initialOwner;
        _mint(initialOwner, MAX_SUPPLY);
        _transferOwnership(initialOwner); // Set the owner manually
    }


    function transfer(address to, uint256 amount) public override returns (bool) {
        _checkFeeAndTransfer(_msgSender(), to, amount);
        return true;
    }

    function transferFrom(address from, address to, uint256 amount) public override returns (bool) {
        _spendAllowance(from, _msgSender(), amount);
        _checkFeeAndTransfer(from, to, amount);
        return true;
    }

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

    function _beforeTokenTransfer(address from, address to, uint256 amount)
        internal
        override(ERC20, ERC20Snapshot)
        whenNotPaused
    {
        if (from != address(0)) require(!blacklisted[from], "Sender blacklisted");
        if (to != address(0)) require(!blacklisted[to], "Recipient blacklisted");
        super._beforeTokenTransfer(from, to, amount);
    }

    function decimals() public pure override returns (uint8) {
        return 18;
    }

    function setTransactionFee(uint256 newFee) external onlyOwner {
        require(newFee <= 100, "Max fee 1%");
        transactionFee = newFee;
    }

    function setFeeCollector(address newCollector) external onlyOwner {
        require(newCollector != address(0), "Invalid address");
        feeCollector = newCollector;
    }

    function whitelistMerchant(address merchant) external onlyOwner {
        whitelistedMerchants[merchant] = true;
        emit MerchantWhitelisted(merchant);
    }

    function removeFromWhitelist(address merchant) external onlyOwner {
        whitelistedMerchants[merchant] = false;
        emit MerchantRemovedFromWhitelist(merchant);
    }

    function setBlacklist(address account, bool status) external onlyOwner {
        blacklisted[account] = status;
        emit BlacklistUpdated(account, status);
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function snapshot() external onlyOwner {
        _snapshot();
    }

    function createOrder(address seller, uint256 amount, string calldata orderReference)
        external nonReentrant returns (uint256)
    {
        require(amount > 0, "Amount must be > 0");
        require(seller != address(0) && seller != msg.sender, "Invalid seller");

        _checkFeeAndTransfer(msg.sender, address(this), amount);

        uint256 orderId = nextOrderId++;
        orders[orderId] = Order({
            buyer: msg.sender,
            seller: seller,
            amount: amount,
            createdAt: block.timestamp,
            status: OrderStatus.Created,
            orderReference: orderReference,
            disputeReason: ""
        });

        emit OrderCreated(orderId, msg.sender, seller, amount, orderReference);
        return orderId;
    }

    function confirmShipment(uint256 orderId) external {
        Order storage order = orders[orderId];
        require(msg.sender == order.seller, "Only seller can confirm");
        require(order.status == OrderStatus.Created, "Invalid status");
        order.status = OrderStatus.Shipped;
        emit OrderShipped(orderId);
    }

    function confirmDelivery(uint256 orderId) external nonReentrant {
        Order storage order = orders[orderId];
        require(msg.sender == order.buyer, "Only buyer");
        require(order.status == OrderStatus.Shipped, "Order not shipped");

        order.status = OrderStatus.Completed;
        _transfer(address(this), order.seller, order.amount);
        emit OrderCompleted(orderId);
    }

    function dispute(uint256 orderId, string calldata reason) external {
        Order storage order = orders[orderId];
        require(msg.sender == order.buyer, "Only buyer");
        require(order.status == OrderStatus.Shipped || order.status == OrderStatus.Created, "Invalid status");
        require(block.timestamp <= order.createdAt + disputePeriod, "Dispute expired");

        order.status = OrderStatus.Disputed;
        order.disputeReason = reason;
        emit OrderDisputed(orderId, reason);
    }

    function resolveDispute(uint256 orderId, address winner) external nonReentrant {
        require(msg.sender == arbitrator, "Only arbitrator");
        require(winner != address(0), "Invalid winner");

        Order storage order = orders[orderId];
        require(order.status == OrderStatus.Disputed, "Not disputed");
        require(winner == order.buyer || winner == order.seller, "Invalid winner");

        if (winner == order.seller) {
            _transfer(address(this), order.seller, order.amount);
            order.status = OrderStatus.Completed;
            emit OrderCompleted(orderId);
        } else {
            _transfer(address(this), order.buyer, order.amount);
            order.status = OrderStatus.Refunded;
            emit OrderRefunded(orderId);
        }

        emit DisputeResolved(orderId, winner);
    }

    function claimExpiredEscrow(uint256 orderId) external nonReentrant {
        Order storage order = orders[orderId];
        require(msg.sender == order.seller, "Only seller");
        require(order.status == OrderStatus.Shipped, "Invalid status");
        require(block.timestamp > order.createdAt + escrowPeriod, "Too early");

        order.status = OrderStatus.Completed;
        _transfer(address(this), order.seller, order.amount);
        emit OrderCompleted(orderId);
    }

    function cancelOrder(uint256 orderId) external nonReentrant {
        Order storage order = orders[orderId];
        require(msg.sender == order.buyer, "Only buyer");
        require(order.status == OrderStatus.Created, "Cannot cancel");

        order.status = OrderStatus.Canceled;
        _transfer(address(this), order.buyer, order.amount);
        emit OrderCanceled(orderId);
    }

    function setArbitrator(address newArbitrator) external onlyOwner {
        require(newArbitrator != address(0), "Invalid arbitrator");
        arbitrator = newArbitrator;
    }

    function setEscrowPeriod(uint256 newPeriod) external onlyOwner {
        require(newPeriod > 0, "Must be > 0");
        escrowPeriod = newPeriod;
    }

    function setDisputePeriod(uint256 newPeriod) external onlyOwner {
        require(newPeriod > 0, "Must be > 0");
        disputePeriod = newPeriod;
    }
}
