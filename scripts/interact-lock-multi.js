import hre from "hardhat";

async function main() {
  const lockAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"; // adjust if needed
  const Lock = await hre.ethers.getContractFactory("Lock");
  const lock = await Lock.attach(lockAddress);

  const signer = (await hre.ethers.getSigners())[0];

  console.log("=== Initial state ===");
  console.log("Owner:", await lock.owner());
  console.log("Unlock time (unix):", (await lock.unlockTime()).toString());
  console.log("Lock balance (ETH):", hre.ethers.formatEther(await hre.ethers.provider.getBalance(lockAddress)));

  // 1) Attempt immediate withdraw (expected to revert)
  try {
    await (await lock.connect(signer).withdraw()).wait();
    console.log("Withdraw succeeded (unexpected)");
  } catch (err) {
    console.log("Immediate withdraw reverted (expected):", err.message.split("\n")[0]);
  }

  // 2) Increase time by 1 day and mine
  if (hre.network.name === "localhost" || hre.network.name === "hardhat") {
    console.log("\nIncreasing time by 1 day...");
    await hre.network.provider.send("evm_increaseTime", [24 * 60 * 60]);
    await hre.network.provider.send("evm_mine");

    try {
      await (await lock.connect(signer).withdraw()).wait();
      console.log("Withdraw after +1 day succeeded (if unlocked)");
    } catch (err) {
      console.log("Withdraw after +1 day reverted (expected if still locked):", err.message.split("\n")[0]);
    }

    // 3) Deposit 0.05 ETH to contract (simulate extra funds)
    console.log("\nSending 0.05 ETH to lock contract...");
    await signer.sendTransaction({ to: lockAddress, value: hre.ethers.parseEther("0.05") });
    console.log("Deposit done. New balance:", hre.ethers.formatEther(await hre.ethers.provider.getBalance(lockAddress)));

    // 4) Increase time by 7 more days
    console.log("\nIncreasing time by 7 days...");
    await hre.network.provider.send("evm_increaseTime", [7 * 24 * 60 * 60]);
    await hre.network.provider.send("evm_mine");

    try {
      await (await lock.connect(signer).withdraw()).wait();
      console.log("Withdraw after +8 days succeeded");
      console.log("Final lock balance:", hre.ethers.formatEther(await hre.ethers.provider.getBalance(lockAddress)));
    } catch (err) {
      console.log("Withdraw failed even after +8 days:", err.message.split("\n")[0]);
    }
  }
}

main().catch(err => { 
  console.error(err); 
  process.exitCode = 1; 
});
