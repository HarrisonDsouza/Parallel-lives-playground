import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  connectWallet,
  getCurrentAccount,
  getEthBalance,
  getTokenBalance,
  giveRegistrationReward,
  givePortfolioCreationReward,
  giveInvestmentGrowthReward,
  isMetaMaskInstalled,
  onAccountsChanged,
  onChainChanged,
  removeAllListeners
} from '../utils/web3';

const Rewards = () => {
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [ethBalance, setEthBalance] = useState('0.0000');
  const [tokenBalance, setTokenBalance] = useState('0.00');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Check wallet connection on component mount
  useEffect(() => {
    checkWalletConnection();
    
    // Set up event listeners
    onAccountsChanged(handleAccountsChanged);
    onChainChanged(handleChainChanged);

    return () => {
      removeAllListeners();
    };
  }, []);

  const checkWalletConnection = async () => {
    try {
      const account = await getCurrentAccount();
      if (account) {
        setWalletAddress(account);
        setWalletConnected(true);
        await updateBalances(account);
      }
    } catch (error) {
      console.error('Error checking wallet connection:', error);
    }
  };

  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      setWalletConnected(false);
      setWalletAddress('');
      setEthBalance('0.0000');
      setTokenBalance('0.00');
    } else {
      setWalletAddress(accounts[0]);
      setWalletConnected(true);
      updateBalances(accounts[0]);
    }
  };

  const handleChainChanged = () => {
    // Reload the page when chain changes
    window.location.reload();
  };

  const updateBalances = async (address) => {
    try {
      const [eth, tokens] = await Promise.all([
        getEthBalance(address),
        getTokenBalance(address)
      ]);
      setEthBalance(eth);
      setTokenBalance(tokens);
    } catch (error) {
      console.error('Error updating balances:', error);
    }
  };

  const handleConnectWallet = async () => {
    if (!isMetaMaskInstalled()) {
      setError('MetaMask is not installed. Please install MetaMask to continue.');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const account = await connectWallet();
      setWalletAddress(account);
      setWalletConnected(true);
      await updateBalances(account);
      setSuccess('Wallet connected successfully!');
    } catch (error) {
      setError(error.message || 'Failed to connect wallet');
    } finally {
      setLoading(false);
    }
  };

  const handleReward = async (rewardFunction, rewardType) => {
    if (!walletConnected) {
      setError('Please connect your wallet first');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const txHash = await rewardFunction(walletAddress);
      setSuccess(`${rewardType} reward sent! Transaction: ${txHash.slice(0, 10)}...`);
      
      // Update balances after a short delay
      setTimeout(() => {
        updateBalances(walletAddress);
      }, 3000);
    } catch (error) {
      setError(error.message || `Failed to send ${rewardType} reward`);
    } finally {
      setLoading(false);
    }
  };

  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-white mb-4">
            InvestAI Rewards
          </h1>
          <p className="text-xl text-blue-200">
            Earn IART tokens for your investment activities
          </p>
        </motion.div>

        {/* Wallet Connection Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8 border border-white/20"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Wallet Connection</h2>
          
          {!walletConnected ? (
            <div className="text-center">
              <div className="mb-6">
                <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-white text-lg mb-4">
                  Connect your MetaMask wallet to earn rewards
                </p>
                <p className="text-blue-200 text-sm mb-6">
                  Make sure you're on the Sepolia testnet to interact with our rewards contract
                </p>
              </div>
              
              <button
                onClick={handleConnectWallet}
                disabled={loading}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Connecting...' : 'Connect Wallet'}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-500/20 rounded-lg border border-green-400/30">
                <div>
                  <p className="text-green-300 text-sm">Connected Wallet</p>
                  <p className="text-white font-mono">{formatAddress(walletAddress)}</p>
                </div>
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-500/20 rounded-lg border border-blue-400/30">
                  <p className="text-blue-300 text-sm">ETH Balance</p>
                  <p className="text-white text-xl font-bold">{ethBalance} ETH</p>
                </div>
                <div className="p-4 bg-purple-500/20 rounded-lg border border-purple-400/30">
                  <p className="text-purple-300 text-sm">IART Token Balance</p>
                  <p className="text-white text-xl font-bold">{tokenBalance} IART</p>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Rewards Section */}
        {walletConnected && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Available Rewards</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Registration Reward */}
              <div className="bg-gradient-to-br from-green-500/20 to-emerald-600/20 rounded-xl p-6 border border-green-400/30">
                <div className="text-center mb-4">
                  <div className="w-16 h-16 mx-auto mb-3 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Registration Reward</h3>
                  <p className="text-green-200 text-sm mb-4">Get 100 IART tokens for registering</p>
                </div>
                <button
                  onClick={() => handleReward(giveRegistrationReward, 'Registration')}
                  disabled={loading}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Processing...' : 'Claim Reward'}
                </button>
              </div>

              {/* Portfolio Creation Reward */}
              <div className="bg-gradient-to-br from-blue-500/20 to-indigo-600/20 rounded-xl p-6 border border-blue-400/30">
                <div className="text-center mb-4">
                  <div className="w-16 h-16 mx-auto mb-3 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 2h12v8H4V6z" />
                      <path d="M6 8h8v2H6V8zm0 4h8v2H6v-2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Portfolio Creation</h3>
                  <p className="text-blue-200 text-sm mb-4">Get 50 IART tokens for creating a portfolio</p>
                </div>
                <button
                  onClick={() => handleReward(givePortfolioCreationReward, 'Portfolio Creation')}
                  disabled={loading}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Processing...' : 'Claim Reward'}
                </button>
              </div>

              {/* Investment Growth Reward */}
              <div className="bg-gradient-to-br from-purple-500/20 to-pink-600/20 rounded-xl p-6 border border-purple-400/30">
                <div className="text-center mb-4">
                  <div className="w-16 h-16 mx-auto mb-3 bg-purple-500 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">Investment Growth</h3>
                  <p className="text-purple-200 text-sm mb-4">Get 25 IART tokens for investment growth</p>
                </div>
                <button
                  onClick={() => handleReward(giveInvestmentGrowthReward, 'Investment Growth')}
                  disabled={loading}
                  className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Processing...' : 'Claim Reward'}
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Status Messages */}
        {(error || success) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-6"
          >
            {error && (
              <div className="bg-red-500/20 border border-red-400/30 rounded-lg p-4 mb-4">
                <p className="text-red-300">{error}</p>
              </div>
            )}
            {success && (
              <div className="bg-green-500/20 border border-green-400/30 rounded-lg p-4">
                <p className="text-green-300">{success}</p>
              </div>
            )}
          </motion.div>
        )}

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-8 bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10"
        >
          <h3 className="text-lg font-bold text-white mb-4">How to Get Started</h3>
          <div className="space-y-2 text-blue-200">
            <p>1. Install MetaMask browser extension</p>
            <p>2. Switch to Sepolia testnet</p>
            <p>3. Connect your wallet</p>
            <p>4. Claim rewards for your investment activities</p>
            <p className="text-sm text-blue-300 mt-4">
              Note: This is a testnet implementation. Rewards are test tokens with no real value.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Rewards;
