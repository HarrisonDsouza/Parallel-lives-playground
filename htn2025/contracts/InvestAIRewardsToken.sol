// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title InvestAIRewardsToken (ERC-20) + ETH Rewards Utilities
 * @notice ERC-20 with MINTER_ROLE for token rewards and TREASURER_ROLE for ETH payouts.
 *         Fund this contract with test ETH, then call sendEthReward/Batch to pay winners.
 */
contract InvestAIRewardsToken is ERC20, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant TREASURER_ROLE = keccak256("TREASURER_ROLE");

    event Funded(address indexed from, uint256 amount);
    event EthRewardSent(address indexed to, uint256 amount);
    event EthRewardsBatchSent(uint256 count, uint256 total);
    event EthSwept(address indexed to, uint256 amount);

    constructor(string memory name_, string memory symbol_, address admin)
        ERC20(name_, symbol_)
    {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(MINTER_ROLE, admin);
        _grantRole(TREASURER_ROLE, admin);
    }

    // ---------- ERC-20 Minting ----------

    function mint(address to, uint256 amount) external onlyRole(MINTER_ROLE) {
        _mint(to, amount);
    }

    // ---------- ETH Funding ----------

    /// @notice Accept plain ETH (fund the contract for payouts).
    receive() external payable {
        emit Funded(msg.sender, msg.value);
    }

    fallback() external payable {
        if (msg.value > 0) emit Funded(msg.sender, msg.value);
    }

    /// @notice Optional explicit fund method.
    function fund() external payable {
        require(msg.value > 0, "No ETH");
        emit Funded(msg.sender, msg.value);
    }

    // ---------- ETH Rewards (Treasurer-only) ----------

    /**
     * @notice Send ETH to a single winner.
     * @param to Recipient wallet (must be a valid address provided by the frontend)
     * @param amount Amount of ETH in wei
     */
    function sendEthReward(address payable to, uint256 amount)
        external
        onlyRole(TREASURER_ROLE)
    {
        require(to != address(0), "Zero address");
        require(address(this).balance >= amount, "Insufficient ETH");
        (bool ok, ) = to.call{value: amount}("");
        require(ok, "Transfer failed");
        emit EthRewardSent(to, amount);
    }

    /**
     * @notice Batch send ETH rewards. Reverts on the first failed transfer.
     * @param recipients Array of winner wallet addresses
     * @param amounts    Matching array of ETH amounts in wei
     */
    function sendEthRewardsBatch(
        address payable[] calldata recipients,
        uint256[] calldata amounts
    )
        external
        onlyRole(TREASURER_ROLE)
    {
        uint256 len = recipients.length;
        require(len == amounts.length, "Length mismatch");
        uint256 total = 0;

        for (uint256 i = 0; i < len; i++) {
            total += amounts[i];
        }
        require(address(this).balance >= total, "Insufficient ETH");

        for (uint256 i = 0; i < len; i++) {
            address payable to = recipients[i];
            require(to != address(0), "Zero address");
            (bool ok, ) = to.call{value: amounts[i]}("");
            require(ok, "Transfer failed");
            emit EthRewardSent(to, amounts[i]);
        }

        emit EthRewardsBatchSent(len, total);
    }

    // ---------- Admin Utilities ----------

    /**
     * @notice Rescue/sweep ETH (e.g., leftover funds).
     * @dev Restricted to TREASURER_ROLE to separate concerns from DEFAULT_ADMIN_ROLE.
     */
    function sweepEth(address payable to, uint256 amount)
        external
        onlyRole(TREASURER_ROLE)
    {
        require(to != address(0), "Zero address");
        require(address(this).balance >= amount, "Insufficient ETH");
        (bool ok, ) = to.call{value: amount}("");
        require(ok, "Sweep failed");
        emit EthSwept(to, amount);
    }
}
