# EComToken

![EComToken Logo](./ECT-3.png)

Welcome to the **EComToken** repository - powering secure, decentralized e-commerce through smart contracts and blockchain automation.

---

## Overview

**EComToken** is an ERC20-based utility token tailored for decentralized commerce. This repository contains:
- **Solidity Smart Contracts**: Core logic for token management, fee control, escrow, and whitelisting.
- **JavaScript Scripts**: For deployment, interaction, and utility functions using Hardhat.

---

## Technology Stack

- **Solidity** - 70.1%: Core smart contracts
- **JavaScript** - 29.9%: Scripts for deployment and integration

---

## Features

- **Decentralized Payment Infrastructure**  
- **Initial Mintable Supply**: 100 million ECOM  
- **Optional Minting Lock**: Finalize minting permanently via `finalizeMinting()`  
- **Transaction Fee Logic**: 1% fee on transfers  
- **Merchant Whitelisting**: Enable privileged features for selected addresses  
- **Blacklist Protection**: Block malicious or restricted actors  
- **Escrow Contract Ready**: Milestone-based secure payment channel  
- **Future-Ready**: bridging (planned)

---

## Tokenomics

| Parameter             | Value                         |
|-----------------------|-------------------------------|
| **Name**              | ECom Token                    |
| **Symbol**            | ECOM                          |
| **Initial Supply**    | 100,000,000 ECOM (minted)     |
| **Decimals**          | 18                            |
| **Mintable**          | ✅ Yes (by owner)             |
| **Fixed Cap**         | ❌ No                         |
| **Fee on Transfer**   | 1%                             |
| **Owner Functions**   | Mint, whitelist, blacklist, pause

---

## Token Supply Model

EComToken starts with an initial supply and allows additional minting by the owner for early-stage needs like presale, liquidity, and ecosystem incentives. The contract includes a `finalizeMinting()` function that can permanently disable minting at any time, offering long-term supply transparency. This flexible model supports project growth while maintaining investor trust.

---

## Known Risks & Areas for Review

- **Blacklist Control**  
  Blacklisted addresses are fully restricted - ensure proper use and logging.

- **Minting Flexibility**  
  Owner can mint until explicitly locked via `finalizeMinting()`.

- **Escrow Integration**  
  Must be deployed separately and reviewed for security.

- **Gas Costs**  
  Some operations like whitelisting or snapshot may have higher gas usage.

---

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) v14+
- [Hardhat](https://hardhat.org/)
- A configured Ethereum wallet and provider (e.g., Infura or Alchemy)

### Installation
```bash
git clone https://github.com/EComToken853/EComToken.git
cd EComToken
npm install
```

---

## Deployment

Update your deployment parameters in `hardhat.config.js` and run:

```bash
npx hardhat run scripts/deploy.js --network <network-name>
```

To verify on Etherscan:
```bash
npx hardhat run scripts/verify.js --network <network-name>
```

---

## Interaction

Use `scripts/interact.js` and other utilities to:
- Mint tokens
- Transfer ECOM
- Whitelist/blacklist merchants
- Test snapshot, pause, and escrow flows

---

## Contribution Guidelines

We welcome open-source contributors!

1. Fork this repo  
2. Create a new branch:  
   `git checkout -b feature/<feature-name>`  
3. Commit and push changes:  
   `git commit -m "Add <feature>" && git push origin feature/<feature-name>`  
4. Open a Pull Request  

---

## License

This project is licensed under the [MIT License](LICENSE).

---

## Contact

Reach out to us via [GitHub Discussions](https://github.com/EComToken853/EComToken/discussions) or join our [Discord Community](https://discord.gg/your-link).

---

