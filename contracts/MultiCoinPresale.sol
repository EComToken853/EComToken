// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract MultiCoinPresale is Ownable, ReentrancyGuard {
    IERC20 public immutable saleToken;

    uint256 public capUSD;
    uint256 public maxContributionUSD;
    uint256 public totalRaisedUSD;
    uint256 public startTime;
    uint256 public endTime;
    bool public finalized;

    struct TokenConfig {
        bool accepted;
        uint256 rate; // tokens per 1 unit (ETH in wei or ERC20 with 18 decimals)
    }

    mapping(address => TokenConfig) public paymentTokens;
    address[] public tokenList;

    mapping(address => uint256) public contributionsUSD;

    event Purchased(address indexed buyer, address paymentToken, uint256 paidAmount, uint256 tokensReceived);
    event PaymentTokenAdded(address token, uint256 rate);
    event PaymentTokenUpdated(address token, uint256 newRate);
    event Finalized();
    event Withdrawn(address ethRecipient, uint256 ethAmount, uint256[] erc20Amounts);
    event TokensWithdrawn(address recipient, uint256 amount);

    modifier presaleActive() {
        require(block.timestamp >= startTime && block.timestamp <= endTime, "Presale inactive");
        require(!finalized, "Presale finalized");
        _;
    }

    constructor(
        address _saleToken,
        uint256 _ethRate,
        uint256 _capUSD,
        uint256 _maxContributionUSD,
        uint256 _startTime,
        uint256 _endTime
    ) {
        require(_saleToken != address(0), "Invalid token");
        require(_startTime < _endTime, "Invalid time range");

        saleToken = IERC20(_saleToken);
        capUSD = _capUSD;
        maxContributionUSD = _maxContributionUSD;
        startTime = _startTime;
        endTime = _endTime;

        // Add ETH as default option using address(0)
        paymentTokens[address(0)] = TokenConfig(true, _ethRate);
        tokenList.push(address(0));
    }

    function addPaymentToken(address token, uint256 rate) external onlyOwner {
        require(!paymentTokens[token].accepted, "Token already added");
        paymentTokens[token] = TokenConfig(true, rate);
        tokenList.push(token);
        emit PaymentTokenAdded(token, rate);
    }

    function updatePaymentTokenRate(address token, uint256 newRate) external onlyOwner {
        require(paymentTokens[token].accepted, "Token not accepted");
        paymentTokens[token].rate = newRate;
        emit PaymentTokenUpdated(token, newRate);
    }

    function buyWithETH() external payable nonReentrant presaleActive {
        require(msg.value > 0, "No ETH sent");
        TokenConfig memory cfg = paymentTokens[address(0)];
        require(cfg.accepted, "ETH not accepted");

        uint256 usdValue = msg.value / 1e16; // Approx 1 ETH = $1000
        require(contributionsUSD[msg.sender] + usdValue <= maxContributionUSD, "Max contribution exceeded");
        require(totalRaisedUSD + usdValue <= capUSD, "Cap exceeded");

        uint256 tokens = (msg.value * cfg.rate) / 1 ether;
        contributionsUSD[msg.sender] += usdValue;
        totalRaisedUSD += usdValue;

        require(saleToken.transfer(msg.sender, tokens), "Token transfer failed");
        emit Purchased(msg.sender, address(0), msg.value, tokens);
    }

    function buyWithERC20(address token, uint256 amount) external nonReentrant presaleActive {
        require(amount > 0, "Zero amount");
        TokenConfig memory cfg = paymentTokens[token];
        require(cfg.accepted, "Token not accepted");

        uint256 usdValue = amount / 1e18; // Assuming token has 18 decimals, 1 token = $1
        require(contributionsUSD[msg.sender] + usdValue <= maxContributionUSD, "Max contribution exceeded");
        require(totalRaisedUSD + usdValue <= capUSD, "Cap exceeded");

        uint256 tokens = amount * cfg.rate;
        contributionsUSD[msg.sender] += usdValue;
        totalRaisedUSD += usdValue;
    
        require(IERC20(token).transferFrom(msg.sender, address(this), amount), "ERC20 transfer failed");
        require(saleToken.transfer(msg.sender, tokens), "Token transfer failed");

        emit Purchased(msg.sender, token, amount, tokens);
    }

    function finalizePresale() external onlyOwner {
        finalized = true;
        emit Finalized();
    }

    function withdrawAll(address payable ethRecipient, address erc20Recipient) external onlyOwner {
        uint256 ethBal = address(this).balance;
        if (ethBal > 0) {
            ethRecipient.transfer(ethBal);
        }

        uint256[] memory balances = new uint256[](tokenList.length);
        for (uint i = 0; i < tokenList.length; i++) {
            address token = tokenList[i];
            if (token == address(0)) continue;
            uint256 bal = IERC20(token).balanceOf(address(this));
            if (bal > 0) {
                IERC20(token).transfer(erc20Recipient, bal);
            }
            balances[i] = bal;
        }

        emit Withdrawn(ethRecipient, ethBal, balances);
    }

    function withdrawUnsoldTokens(address recipient) external onlyOwner {
        uint256 unsold = saleToken.balanceOf(address(this));
        require(unsold > 0, "Nothing to withdraw");
        saleToken.transfer(recipient, unsold);
        emit TokensWithdrawn(recipient, unsold);
    }

    function getAllPaymentTokens() external view returns (address[] memory) {
        return tokenList;
    }

    function getRate(address token) external view returns (uint256) {
        return paymentTokens[token].rate;
    }
}
