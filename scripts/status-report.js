import hre from "hardhat";

async function main() {
  const [deployer, user1, user2] = await hre.ethers.getSigners();

  // Replace with actual deployed addresses
  const lockAddress = "LOCK_ADDRESS_FROM_DEPLOY";
  const counterAddress = "COUNTER_ADDRESS_FROM_DEPLOY";

  const Lock = await hre.ethers.getContractFactory("Lock");
  const Counter = await hre.ethers.getContractFactory("Counter");

  const lock = Lock.attach(lockAddress);
  const counter = Counter.attach(counterAddress);

  console.log("=== Status Report ===\n");

  // Lock status
  console.log("🔒 Lock Contract:");
  console.log(" Address:", lockAddress);
  console.log(" Owner:", await lock.owner());
  console.log(" Unlock time (unix):", (await lock.unlockTime()).toString());
  console.log(" Balance (ETH):", hre.ethers.formatEther(
    await hre.ethers.provider.getBalance(lockAddress)
  ));

  // Counter status
  console.log("\n🧮 Counter Contract:");
  console.log(" Address:", counterAddress);
  console.log(" Value:", (await counter.get()).toString());

  // Accounts balances
  console.log("\n💰 Accounts:");
  for (let i = 0; i < 3; i++) {
    console.log(
      ` ${await (await hre.ethers.provider.getBalance(
        (await hre.ethers.getSigners())[i].address
      )).then(b => hre.ethers.formatEther(b))} ETH - Signer ${i}`
    );
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
