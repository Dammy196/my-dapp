import hre from "hardhat";

async function main() {
  const counterAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // replace with your deployed address
  const Counter = await hre.ethers.getContractFactory("Counter");
  const counter = await Counter.attach(counterAddress);

  // Read current value
  const current = await counter.x();
  console.log("Current counter value:", current.toString());

  // Increment by 2
  const tx1 = await counter.incBy(2);
  await tx1.wait();
  console.log("Incremented by 2");

  // Increment by 3
  const tx2 = await counter.incBy(3);
  await tx2.wait();
  console.log("Incremented by 3");

  // Increment by 7
  const tx3 = await counter.incBy(7);
  await tx3.wait();
  console.log("Incremented by 7");


  // Read new value
  const updated = await counter.x();
  console.log("Updated counter value:", updated.toString());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
