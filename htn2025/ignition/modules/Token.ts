import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("InvestAIRewardsToken", (m) => {
  const name = m.getParameter("name", "InvestAI Rewards Token");
  const symbol = m.getParameter("symbol", "IART");
  const admin = m.getParameter("admin", m.getAccount(0));
  
  const token = m.contract("InvestAIRewardsToken", [name, symbol, admin]);
  return { token };
});
