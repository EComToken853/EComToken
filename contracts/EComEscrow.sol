// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract EComEscrow is Ownable, ReentrancyGuard {
    IERC20 public ecomToken;
    
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
    
    constructor(address tokenAddress, address initialOwner) Ownable(initialOwner) {
        ecomToken = IERC20(tokenAddress);
        arbitrator = initialOwner;
    }
    
    function createOrder(address seller, uint256 amount, string calldata orderReference) external nonReentrant returns (uint256) {
        require(amount > 0, "Amount must be greater than 0");
        require(seller != address(0), "Invalid seller address");
        require(seller != msg.sender, "Seller cannot be buyer");
        
        // Transfer tokens from buyer to escrow
        require(ecomToken.transferFrom(msg.sender, address(this), amount), "Token transfer failed");
        
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
        require(msg.sender == order.seller, "Only seller can confirm shipment");
        require(order.status == OrderStatus.Created, "Invalid order status");
        
        order.status = OrderStatus.Shipped;
        emit OrderShipped(orderId);
    }
    
    function confirmDelivery(uint256 orderId) external nonReentrant {
        Order storage order = orders[orderId];
        require(msg.sender == order.buyer, "Only buyer can confirm delivery");
        require(order.status == OrderStatus.Shipped, "Order not shipped");
        
        order.status = OrderStatus.Completed;
        
        // Release funds to seller
        require(ecomToken.transfer(order.seller, order.amount), "Token transfer failed");
        
        emit OrderCompleted(orderId);
    }
    
    function dispute(uint256 orderId, string calldata reason) external {
        Order storage order = orders[orderId];
        require(msg.sender == order.buyer, "Only buyer can dispute");
        require(order.status == OrderStatus.Shipped || order.status == OrderStatus.Created, "Cannot dispute at current status");
        require(block.timestamp <= order.createdAt + disputePeriod, "Dispute period expired");
        
        order.status = OrderStatus.Disputed;
        order.disputeReason = reason;
        
        emit OrderDisputed(orderId, reason);
    }
    
    function resolveDispute(uint256 orderId, address winner) external nonReentrant {
        require(msg.sender == arbitrator, "Only arbitrator can resolve disputes");
        
        Order storage order = orders[orderId];
        require(order.status == OrderStatus.Disputed, "Order not disputed");
        require(winner == order.buyer || winner == order.seller, "Winner must be buyer or seller");
        
        if (winner == order.seller) {
            // Release funds to seller
            require(ecomToken.transfer(order.seller, order.amount), "Token transfer failed");
            order.status = OrderStatus.Completed;
        } else {
            // Refund to buyer
            require(ecomToken.transfer(order.buyer, order.amount), "Token transfer failed");
            order.status = OrderStatus.Refunded;
        }
        
        emit DisputeResolved(orderId, winner);
    }
    
    function claimExpiredEscrow(uint256 orderId) external nonReentrant {
        Order storage order = orders[orderId];
        require(msg.sender == order.seller, "Only seller can claim expired escrow");
        require(order.status == OrderStatus.Shipped, "Order not in shipped status");
        require(block.timestamp > order.createdAt + escrowPeriod, "Escrow period not expired");
        
        order.status = OrderStatus.Completed;
        
        // Release funds to seller after escrow period
        require(ecomToken.transfer(order.seller, order.amount), "Token transfer failed");
        
        emit OrderCompleted(orderId);
    }
    
    function cancelOrder(uint256 orderId) external nonReentrant {
        Order storage order = orders[orderId];
        require(msg.sender == order.buyer, "Only buyer can cancel");
        require(order.status == OrderStatus.Created, "Can only cancel if not shipped");
        
        order.status = OrderStatus.Canceled;
        
        // Refund to buyer
        require(ecomToken.transfer(order.buyer, order.amount), "Token transfer failed");
        
        emit OrderCanceled(orderId);
    }
    
    function setArbitrator(address newArbitrator) external onlyOwner {
        require(newArbitrator != address(0), "Invalid address");
        arbitrator = newArbitrator;
    }
    
    function setEscrowPeriod(uint256 newPeriod) external onlyOwner {
        require(newPeriod > 0, "Period must be greater than 0");
        escrowPeriod = newPeriod;
    }
    
    function setDisputePeriod(uint256 newPeriod) external onlyOwner {
        require(newPeriod > 0, "Period must be greater than 0");
        disputePeriod = newPeriod;
    }
}