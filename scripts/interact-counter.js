import hre from "hardhat";

async function main() {
  const counterAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // replace with your deployed address
  const Counter = await hre.ethers.getContractFactory("Counter");
  const counter = await Counter.attach(counterAddress);

  // Read current value
  const current = await counter.x();
  console.log("Current counter value:", current.toString());

  // Increment by 1
  const tx1 = await counter.inc();
  await tx1.wait();
  console.log("Incremented by 1");

  // Increment by 5
  const tx2 = await counter.incBy(5);
  await tx2.wait();
  console.log("Incremented by 5");

  // Read new value
  const updated = await counter.x();
  console.log("Updated counter value:", updated.toString());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
