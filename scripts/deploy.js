const { ethers } = require("hardhat");

async function main() {
    // ✅ Sanity check
    const [deployer] = await ethers.getSigners();
    console.log("Deploying from account:", deployer.address);

    const network = await ethers.provider.getNetwork();
    console.log("Network:", network.name, "Chain ID:", network.chainId);

    const balance = await ethers.provider.getBalance(deployer.address);
    console.log("Balance:", ethers.formatEther(balance), "ETH");

    // ✅ Deploy contract
    const Greeter = await ethers.getContractFactory("Greeter");
    const greeter = await Greeter.deploy("Hello, Hardhat!");
    await greeter.waitForDeployment();

    console.log("Greeter deployed to:", await greeter.getAddress());

    // ✅ Interact with contract
    let currentGreeting = await greeter.greet();
    console.log("Current greeting:", currentGreeting);

    const tx = await greeter.setGreeting("Hello, Damian!");
    await tx.wait();

    currentGreeting = await greeter.greet();
    console.log("Updated greeting:", currentGreeting);
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
