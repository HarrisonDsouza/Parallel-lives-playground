/**
 * Web3 utilities for wallet connection and blockchain interactions
 * Based on the InvestAIRewardsToken contract from htn2025
 */

// Contract configuration
const CONTRACT_ADDRESS = "0x"; // TODO: Replace with deployed contract address
const CONTRACT_ABI = [
  // ERC20 functions
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
  "function name() view returns (string)",
  
  // Minting functions (MINTER_ROLE required)
  "function mint(address to, uint256 amount)",
  
  // Events
  "event Transfer(address indexed from, address indexed to, uint256 value)"
];

// Sepolia testnet configuration
const SEPOLIA_CHAIN_ID = "0xaa36a7"; // 11155111 in hex
const SEPOLIA_RPC_URL = "https://sepolia.infura.io/v3/YOUR_INFURA_KEY";

/**
 * Check if MetaMask is installed
 */
export function isMetaMaskInstalled() {
  return typeof window !== 'undefined' && typeof window.ethereum !== 'undefined';
}

/**
 * Connect to MetaMask wallet
 */
export async function connectWallet() {
  if (!isMetaMaskInstalled()) {
    throw new Error('MetaMask is not installed. Please install MetaMask to continue.');
  }

  try {
    // Request account access
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    });

    if (accounts.length === 0) {
      throw new Error('No accounts found. Please make sure MetaMask is unlocked.');
    }

    // Switch to Sepolia testnet
    await switchToSepolia();

    return accounts[0];
  } catch (error) {
    console.error('Error connecting wallet:', error);
    throw error;
  }
}

/**
 * Switch to Sepolia testnet
 */
export async function switchToSepolia() {
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: SEPOLIA_CHAIN_ID }],
    });
  } catch (switchError) {
    // This error code indicates that the chain has not been added to MetaMask
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: SEPOLIA_CHAIN_ID,
              chainName: 'Sepolia Test Network',
              nativeCurrency: {
                name: 'SepoliaETH',
                symbol: 'SEP',
                decimals: 18,
              },
              rpcUrls: [SEPOLIA_RPC_URL],
              blockExplorerUrls: ['https://sepolia.etherscan.io/'],
            },
          ],
        });
      } catch (addError) {
        throw new Error('Failed to add Sepolia network to MetaMask');
      }
    } else {
      throw new Error('Failed to switch to Sepolia network');
    }
  }
}

/**
 * Get current connected account
 */
export async function getCurrentAccount() {
  if (!isMetaMaskInstalled()) {
    return null;
  }

  try {
    const accounts = await window.ethereum.request({
      method: 'eth_accounts',
    });
    return accounts.length > 0 ? accounts[0] : null;
  } catch (error) {
    console.error('Error getting current account:', error);
    return null;
  }
}

/**
 * Get ETH balance for an address
 */
export async function getEthBalance(address) {
  if (!isMetaMaskInstalled()) {
    throw new Error('MetaMask is not installed');
  }

  try {
    const balance = await window.ethereum.request({
      method: 'eth_getBalance',
      params: [address, 'latest'],
    });
    
    // Convert from wei to ETH
    return parseFloat(parseInt(balance, 16) / Math.pow(10, 18)).toFixed(4);
  } catch (error) {
    console.error('Error getting ETH balance:', error);
    throw error;
  }
}

/**
 * Get token balance for an address
 */
export async function getTokenBalance(address) {
  if (!CONTRACT_ADDRESS || CONTRACT_ADDRESS === "0x") {
    throw new Error('Contract address not configured');
  }

  try {
    // Call balanceOf function
    const data = `0x70a08231000000000000000000000000${address.slice(2)}`;
    
    const result = await window.ethereum.request({
      method: 'eth_call',
      params: [
        {
          to: CONTRACT_ADDRESS,
          data: data,
        },
        'latest',
      ],
    });

    // Convert from wei to token units (assuming 18 decimals)
    const balance = parseInt(result, 16);
    return parseFloat(balance / Math.pow(10, 18)).toFixed(2);
  } catch (error) {
    console.error('Error getting token balance:', error);
    return '0.00';
  }
}

/**
 * Mint tokens for registration reward
 */
export async function giveRegistrationReward(userAddress, amount = "100") {
  return await mintTokens(userAddress, amount, "Registration");
}

/**
 * Mint tokens for portfolio creation reward
 */
export async function givePortfolioCreationReward(userAddress, amount = "50") {
  return await mintTokens(userAddress, amount, "Portfolio Creation");
}

/**
 * Mint tokens for investment growth reward
 */
export async function giveInvestmentGrowthReward(userAddress, amount = "25") {
  return await mintTokens(userAddress, amount, "Investment Growth");
}

/**
 * Generic function to mint tokens (requires MINTER_ROLE)
 */
async function mintTokens(toAddress, amount, rewardType) {
  if (!CONTRACT_ADDRESS || CONTRACT_ADDRESS === "0x") {
    throw new Error('Contract address not configured');
  }

  if (!isMetaMaskInstalled()) {
    throw new Error('MetaMask is not installed');
  }

  try {
    const currentAccount = await getCurrentAccount();
    if (!currentAccount) {
      throw new Error('No wallet connected');
    }

    // Convert amount to wei (18 decimals)
    const amountInWei = (parseFloat(amount) * Math.pow(10, 18)).toString(16);
    const paddedAmount = amountInWei.padStart(64, '0');
    const paddedAddress = toAddress.slice(2).padStart(64, '0');

    // mint(address to, uint256 amount) function signature
    const data = `0x40c10f19000000000000000000000000${paddedAddress}${paddedAmount}`;

    const txHash = await window.ethereum.request({
      method: 'eth_sendTransaction',
      params: [
        {
          from: currentAccount,
          to: CONTRACT_ADDRESS,
          data: data,
          gas: '0x5208', // 21000 gas limit
        },
      ],
    });

    console.log(`${rewardType} reward transaction sent:`, txHash);
    return txHash;
  } catch (error) {
    console.error(`Error giving ${rewardType} reward:`, error);
    throw error;
  }
}

/**
 * Listen for account changes
 */
export function onAccountsChanged(callback) {
  if (isMetaMaskInstalled()) {
    window.ethereum.on('accountsChanged', callback);
  }
}

/**
 * Listen for chain changes
 */
export function onChainChanged(callback) {
  if (isMetaMaskInstalled()) {
    window.ethereum.on('chainChanged', callback);
  }
}

/**
 * Remove event listeners
 */
export function removeAllListeners() {
  if (isMetaMaskInstalled()) {
    window.ethereum.removeAllListeners('accountsChanged');
    window.ethereum.removeAllListeners('chainChanged');
  }
}
