# InvestAI Rewards System Setup Guide

## Overview
The rewards system has been successfully integrated into your Parallel Lives Playground application. Users can now earn IART (InvestAI Rewards Token) tokens for various investment activities.

## What's Been Implemented

### 1. Smart Contract Integration
- **Contract**: `InvestAIRewardsToken.sol` (ERC-20 token with minting capabilities)
- **Location**: `htn2025/contracts/InvestAIRewardsToken.sol`
- **Features**: 
  - ERC-20 token with 18 decimals
  - Role-based access control (MINTER_ROLE, TREASURER_ROLE)
  - ETH rewards functionality
  - Token minting for rewards

### 2. Frontend Components
- **Rewards Page**: `frontend/src/pages/Rewards.jsx`
- **Web3 Utils**: `frontend/src/utils/web3.js`
- **Navigation**: Added to main app navigation with 🎁 icon

### 3. Reward Functions
Three blockchain interaction functions have been implemented:

1. **`giveRegistrationReward(userAddress, amount = "100")`**
   - Rewards: 100 IART tokens
   - Trigger: User registration/account creation

2. **`givePortfolioCreationReward(userAddress, amount = "50")`**
   - Rewards: 50 IART tokens
   - Trigger: Creating a new investment portfolio

3. **`giveInvestmentGrowthReward(userAddress, amount = "25")`**
   - Rewards: 25 IART tokens
   - Trigger: Investment portfolio growth milestones

## Setup Instructions

### Step 1: Deploy the Smart Contract

1. Navigate to the htn2025 directory:
   ```bash
   cd htn2025
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables in `.env`:
   ```
   SEPOLIA_PRIVATE_KEY=your_private_key_here
   ETHERSCAN_API_KEY=your_etherscan_api_key_here
   ```

4. Deploy to Sepolia testnet:
   ```bash
   npm run deploy
   ```

5. Copy the deployed contract address from the output.

### Step 2: Update Frontend Configuration

1. Open `frontend/src/utils/web3.js`
2. Replace the CONTRACT_ADDRESS placeholder:
   ```javascript
   const CONTRACT_ADDRESS = "0xYOUR_DEPLOYED_CONTRACT_ADDRESS_HERE";
   ```

3. Update the Infura RPC URL (optional):
   ```javascript
   const SEPOLIA_RPC_URL = "https://sepolia.infura.io/v3/YOUR_INFURA_KEY";
   ```

### Step 3: Grant Minter Role (Important!)

The deployed contract needs to grant MINTER_ROLE to the address that will be calling the reward functions. You can do this through:

1. **Etherscan Contract Interaction**:
   - Go to your contract on Sepolia Etherscan
   - Use the "Write Contract" tab
   - Call `grantRole(MINTER_ROLE, your_address)`

2. **Using the mint script**:
   - Update `scripts/mint.ts` with your contract address
   - Run: `npm run mint`

## How It Works

### User Flow
1. User visits `/rewards` page
2. System prompts to connect MetaMask wallet
3. User connects wallet (automatically switches to Sepolia testnet)
4. Page displays:
   - ETH balance
   - IART token balance
   - Available reward buttons
5. User clicks reward buttons to claim tokens
6. Transactions are sent to the blockchain
7. Balances update after confirmation

### Technical Flow
1. **Wallet Connection**: Uses MetaMask's ethereum provider
2. **Network Switching**: Automatically switches to Sepolia testnet
3. **Balance Queries**: Calls contract's `balanceOf` function
4. **Token Minting**: Calls contract's `mint` function with MINTER_ROLE
5. **Transaction Monitoring**: Tracks transaction hashes and updates UI

## Security Considerations

- **Testnet Only**: This implementation is for Sepolia testnet
- **Role-Based Access**: Only addresses with MINTER_ROLE can mint tokens
- **MetaMask Required**: Users need MetaMask browser extension
- **Gas Fees**: Users pay Sepolia testnet gas fees for transactions

## Integration Points

The reward functions can be integrated into your existing flows:

1. **Registration Reward**: Call `giveRegistrationReward()` after successful user registration
2. **Portfolio Reward**: Call `givePortfolioCreationReward()` when users create portfolios
3. **Growth Reward**: Call `giveInvestmentGrowthReward()` based on investment performance

## Troubleshooting

### Common Issues:
1. **"Contract address not configured"**: Update CONTRACT_ADDRESS in web3.js
2. **"MetaMask is not installed"**: User needs to install MetaMask extension
3. **"Unauthorized" errors**: Ensure the calling address has MINTER_ROLE
4. **Network errors**: Ensure user is on Sepolia testnet

### Testing:
1. Get Sepolia testnet ETH from faucets
2. Connect wallet on `/rewards` page
3. Test each reward function
4. Verify token balance updates

## Files Modified/Created

### New Files:
- `frontend/src/pages/Rewards.jsx` - Main rewards page component
- `frontend/src/utils/web3.js` - Web3 interaction utilities
- `REWARDS_SETUP.md` - This setup guide

### Modified Files:
- `frontend/src/main.jsx` - Added rewards route
- `frontend/src/App.jsx` - Added rewards navigation link

The rewards system is now fully integrated and ready for use once the smart contract is deployed and configured!
