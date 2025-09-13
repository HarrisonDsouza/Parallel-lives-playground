import { network } from "hardhat";
import { parseUnits } from "viem";

const { viem } = await network.connect({
  network: "sepolia",
  chainType: "l1",
});

const publicClient = await viem.getPublicClient();
const [walletClient] = await viem.getWalletClients();

// TODO: Replace with your deployed token address
const tokenAddress = "0x";

const token = await viem.getContractAt("InvestAIRewardsToken", tokenAddress, {
  client: {
    public: publicClient,
    wallet: walletClient,
  },
});

// TODO: Replace with the address you want to mint tokens to
const to = "0x";

// TODO: Replace with the amount of tokens you want to mint
const amount = "1";

const decimals = await token.read.decimals();
const value = parseUnits(amount, Number(decimals));

const hash = await token.write.mint([to, value]);

await publicClient.waitForTransactionReceipt({ hash });

console.log(`Minted ${amount} $${await token.read.symbol()} to ${to}`);
