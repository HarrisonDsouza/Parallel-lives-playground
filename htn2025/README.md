# Hack the North 2025 Example Project

This project showcases a Hardhat 3 Beta project using the `viem` library for Ethereum interactions.

## Project Overview

This example project includes:

- **Hardhat 3 Beta** with TypeScript configuration
- **OpenZeppelin Contracts** for contract implementations and utilities
- **Viem library** for type-safe Ethereum interactions
- **Ignition deployment modules** for reproducible deployments
- **Testing environments** including local simulation and Sepolia testnet

## Quick Start

### Available Scripts

```bash
# Build the project
npm run build

# Deploy to Sepolia testnet
npm run deploy

# Run token minting script
npm run mint

# Verify contracts on Etherscan
npm run verify -- <CONTRACT_ADDRESS> <INITIAL_SUPPLY>
```

### Deployment

#### Sepolia Testnet Deployment

First, configure your private key:

```bash
npx hardhat keystore set SEPOLIA_PRIVATE_KEY
```

Then deploy:

```bash
npm run deploy
```

#### Etherscan Contract Verification

First, configure your Etherscan API key:

```bash
npx hardhat keystore set ETHERSCAN_API_KEY
```

Then verify your contract:

```bash
npm run verify -- <CONTRACT_ADDRESS> <INITIAL_SUPPLY>
```
