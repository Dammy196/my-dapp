import hre from "hardhat";

async function main() {
  const lockAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"; // make sure this matches deployed contract
  const Lock = await hre.ethers.getContractFactory("Lock");
  const lock = await Lock.attach(lockAddress);

  // 1) Read state
  const owner = await lock.owner();
  const unlockTime = await lock.unlockTime();
  const balance = await hre.ethers.provider.getBalance(lockAddress);

  console.log("Owner:", owner);
  console.log("Unlock time (unix):", unlockTime.toString());
  console.log("Lock balance (wei):", balance.toString());
  console.log("Lock balance (ETH):", hre.ethers.formatEther(balance));

  // 2) Attempt withdraw (will fail if lock not expired)
  try {
    console.log("\nAttempting immediate withdraw (should revert if not unlocked)...");
    const signer = (await hre.ethers.getSigners())[0];
    const lockAsOwner = lock.connect(signer);
    const tx = await lockAsOwner.withdraw();
    await tx.wait();
    console.log("Withdraw succeeded (unexpected).");
  } catch (err) {
    console.log("Withdraw reverted (expected if still locked):", err.message.split("\n")[0]);
  }

  // 3) Fast-forward time on local node by +8 days and mine a block
  if (hre.network.name === "localhost" || hre.network.name === "hardhat") {
    const seconds = 8 * 24 * 60 * 60;
    console.log(`\nIncreasing time by 8 days (${seconds} seconds) and mining a block...`);
    await hre.network.provider.send("evm_increaseTime", [seconds]);
    await hre.network.provider.send("evm_mine");
    console.log("Time increased and block mined.");

    try {
      const signer = (await hre.ethers.getSigners())[0];
      const lockAsOwner = lock.connect(signer);
      const tx2 = await lockAsOwner.withdraw();
      await tx2.wait();
      console.log("Withdraw after time advance succeeded.");
      const newBal = await hre.ethers.provider.getBalance(lockAddress);
      console.log("New lock balance (ETH):", hre.ethers.formatEther(newBal));
    } catch (err) {
      console.error("Withdraw failed even after time advance:", err.message.split("\n")[0]);
    }
  } else {
    console.log("\nTime-advance not available on public networks. Skipping automatic withdraw test.");
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
