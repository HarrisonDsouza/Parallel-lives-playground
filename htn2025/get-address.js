const { createWalletClient, http } = require('viem');
const { privateKeyToAccount } = require('viem/accounts');

const account = privateKeyToAccount('0xb45366b04ad2c701b0808e7e78a6a1d736d744aef57d3ec1ccda1db4e9f10a60');
console.log('Your wallet address:', account.address);
