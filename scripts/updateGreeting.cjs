const { ethers } = require("hardhat");

async function main() {
  const [owner] = await ethers.getSigners();
  console.log("Using account:", owner.address);

  const greeterAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const greeter = await ethers.getContractAt("Greeter", greeterAddress, owner);

  const currentGreeting = await greeter.greet();
  console.log("Current Greeting:", currentGreeting);

  const tx = await greeter.setGreeting("Hello from CJS script!");
  console.log("Transaction sent:", tx.hash);

  await tx.wait();
  console.log("Transaction mined.");

  const newGreeting = await greeter.greet();
  console.log("New Greeting:", newGreeting);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
