// frontend/src/App.js
import { useState } from "react";
import { ethers } from "ethers";
import GreeterImported from "./Greeter.json"; // ABI array or object

// Put your deployed address here (the one printed by deploy)
const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

function App() {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);
  const [greeting, setGreetingValue] = useState("");
  const [newGreeting, setNewGreeting] = useState("");

  // Normalize ABI: support both "ABI array" and "{ abi: [...] }"
  const abi = Array.isArray(GreeterImported)
    ? GreeterImported
    : GreeterImported?.abi ?? GreeterImported;

  // Connect MetaMask
  async function connectWallet() { 
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        const selectedAccount = accounts[0];
        setAccount(selectedAccount);

        const balanceWei = await provider.getBalance(selectedAccount);
        const balanceEth = ethers.formatEther(balanceWei);
        setBalance(balanceEth);

      } catch (error) {
        console.error(error);
      }
    } else {
      alert("MetaMask not detected!");
    }
  }

  // Read greeting
  async function fetchGreeting() {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(contractAddress, abi, provider);
      const data = await contract.greet();
      setGreetingValue(data);
    } catch (error) {
      console.error(error);
    }
  }

  // Set greeting
  async function updateGreeting() {
    if (!newGreeting) return;

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi, signer);
      const tx = await contract.setGreeting(newGreeting);
      await tx.wait();
      fetchGreeting();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div>
      <h1>Greeter Dapp</h1>

      {!account ? (
        <button onClick={connectWallet}>Connect Wallet</button>
      ) : (
        <>
          <p><strong>Account:</strong> {account}</p>
          <p><strong>Balance:</strong> {balance} ETH</p>
        </>
      )}

      <hr />

      <button onClick={fetchGreeting}>Load Greeting</button>
      <p><strong>Greeting:</strong> {greeting}</p>

      <input
        type="text"
        value={newGreeting}
        onChange={(e) => setNewGreeting(e.target.value)}
        placeholder="New greeting..."
      />
      <button onClick={updateGreeting}>Set Greeting</button>
    </div>
  );
}

export default App;
