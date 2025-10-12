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
      } catch (err) {
        console.error("Wallet connection failed:", err);
      }
    } else {
      alert("Please install MetaMask!");
    }
  }

  // Get contract instance
  async function getContract() {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    return contract;
  }

  // Read greeting
  async function fetchGreeting() {
    try {
      const contract = await getContract();
      const currentGreeting = await contract.greet();
      setGreetingValue(currentGreeting);
    } catch (err) {
      console.error("fetchGreeting error:", err);
      alert("Error fetching greeting — open console for details.");
    }
  }

  // Write greeting
  async function updateGreeting() {
    if (!newGreeting) return;
    try {
      const contract = await getContract();
      const tx = await contract.setGreeting(newGreeting);
      await tx.wait();
      await fetchGreeting();
    } catch (err) {
      console.error("updateGreeting error:", err);
      alert("Error updating greeting — open console for details.");
    }
  }

  // ---------- DEBUG: Deep diagnostics ----------
  async function runDiagnostics() {
    try {
      if (!window.ethereum) {
        console.error("No window.ethereum found");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);

      // 1) chainId (hex)
      const chainId = await provider.send("eth_chainId", []);
      console.log("DIAG chainId (hex):", chainId);

      // 2) accounts exposed
      const accounts = await provider.send("eth_accounts", []);
      console.log("DIAG accounts:", accounts);

      // 3) provider getCode (does contract exist here?)
      const code = await provider.send("eth_getCode", [contractAddress, "latest"]);
      console.log("DIAG eth_getCode:", code);

      // 4) Low-level call: encode greet() and do eth_call
      const iface = new ethers.Interface(abi);
      const data = iface.encodeFunctionData("greet", []);
      console.log("DIAG encoded greet() data:", data);

      const raw = await provider.send("eth_call", [{ to: contractAddress, data }, "latest"]);
      console.log("DIAG eth_call raw result:", raw);

      if (!raw || raw === "0x") {
        console.warn("DIAG: eth_call returned empty (0x). That means no return data — likely no contract code at that address on the current chain, or the call reverted silently.");
      } else {
        // 5) Try to decode
        try {
          const decoded = iface.decodeFunctionResult("greet", raw);
          console.log("DIAG decoded greet result:", decoded);
        } catch (err) {
          console.error("DIAG decode error (ABI mismatch?):", err);
        }
      }

      // 6) Try high-level contract.greet() (same call your app uses)
      try {
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(contractAddress, abi, signer);
        const greetingFromContract = await contract.greet();
        console.log("DIAG contract.greet() result:", greetingFromContract);
      } catch (err) {
        console.error("DIAG contract.greet() error:", err);
      }

      // Done
      console.log("DIAG complete.");
    } catch (err) {
      console.error("runDiagnostics fatal:", err);
    }
  }
  // ---------- end diagnostics ----------

  return (
    <div style={{ padding: "20px" }}>
      <h1>Hardhat + MetaMask + React Greeter</h1>
      {!account ? (
        <button onClick={connectWallet}>Connect MetaMask</button>
      ) : (
        <div>
          <p><b>Account:</b> {account}</p>
          <p><b>Balance:</b> {balance} ETH</p>
        </div>
      )}

      <hr />

      <div>
        <button onClick={fetchGreeting}>Fetch Greeting</button>
        <button onClick={runDiagnostics} style={{ marginLeft: 8 }}>Run Diagnostics</button>
        {greeting && <p><b>Current Greeting:</b> {greeting}</p>}
      </div>

      <div style={{ marginTop: 16 }}>
        <input
          type="text"
          placeholder="New greeting"
          value={newGreeting}
          onChange={(e) => setNewGreeting(e.target.value)}
        />
        <button onClick={updateGreeting} style={{ marginLeft: 8 }}>Set Greeting</button>
      </div>
    </div>
  );
}

export default App;
