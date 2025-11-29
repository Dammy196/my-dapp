# my-dapp — Project Summary

Last updated: November 29, 2025

Author: Damian (project owner)

---

## Executive Summary (one-page)

my-dapp is a small, low-budget personal project exploring blockchain engineering by forking Ethereum's tooling and runtime model (locally) and building a custom chain with additional features. The project's immediate objectives are:

- Learn and document the end-to-end lifecycle: compile, deploy, run local nodes, execute scripts, and connect a CRA frontend to smart contracts.
- Build a reproducible local development environment (Hardhat + Ignition + Foundry optional) and demonstrate contract deployment and interaction patterns.
- Capture design decisions and a roadmap to eventually create a customized blockchain forked from Ethereum's fundamentals but with new protocol-level or ecosystem features.

This document is a practical guide and learning artifact: it contains hands-on commands, checks, troubleshooting tips, and a recommended roadmap to advance the project.

---

## Short Personal Bio (for context)

Damian: mathematical mind, background in biotech and engineering, published in medical fields, skilled problem-solver. Learning blockchain development with a focus on reproducible, low-cost approaches.

---

## What you have already learned / completed

- Created and inspected Solidity contracts in `contracts/` (`Greeter.sol`, `Counter.sol`, `Lock.sol`).
- Built and used Hardhat artifacts (compiled ABI and deployed bytecode stored under `artifacts/`).
- Ran a local Hardhat node (`npx hardhat node`) and executed deploy scripts against it.
- Written small scripts (CommonJS or ESM depending on environment) to interact with contracts (e.g., `scripts/updateGreeting.cjs`).
- Built a simple React front end (Create React App) that can load an ABI and call contract methods via `ethers`.

---

## High-level architecture & components

- Local dev chain: Hardhat Node (an Ethereum-compatible JSON-RPC node) for fast local testing.
- Contract compilation & artifacts: Hardhat compiles contracts and writes artifacts to `artifacts/` and caches to `cache/`.
- Deployment and scripts: `scripts/` contains Node scripts (use `npx hardhat run` to execute under the Hardhat runtime). Use `--network localhost` to target the running node.
- Frontend: `frontend/` (CRA) contains a simple UI that imports the contract ABI (e.g., `frontend/src/Greeter.json`) and uses `ethers` to call the contract's `greet()` and `setGreeting()`.
- Ignition modules: `ignition/` holds Hardhat Ignition assets for structured deployments.

---

## Reproducible local workflow (step-by-step)

1) Prerequisites

- Node.js (recommended: 18+ LTS)
- npm or yarn
- Git
- MetaMask (for browser interactions)

2) Install

```bash
# in repo root
npm install
# frontend deps
cd frontend && npm install
```

3) Start local node

```bash
npx hardhat node
```

Keep this running in a separate terminal.

4) Deploy contracts locally (example)

```bash
npx hardhat run scripts/deploy.js --network localhost
```

Take note of the deployed contract addresses printed in the script output. Save them to `.env` or pass them to scripts via `GREETER_ADDRESS`.

5) Interact with contracts via scripts (example updateGreeting)

```bash
# set greeter via env
$env:GREETER_ADDRESS="0x..."  # PowerShell
npx hardhat run scripts/updateGreeting.cjs --network localhost

# or pass as arg (script should read process.argv[2])
node scripts/updateGreeting.cjs 0xYourAddress
```

6) Run frontend and test from browser

```bash
cd frontend
npm start
```

Open the app in your browser, connect MetaMask to `http://127.0.0.1:8545` (import an account via private key from the Hardhat node output), then use the UI to read and set values.

---

## Code & file locations (cheat sheet)

- Contracts: `contracts/*.sol`
- Compiled artifacts: `artifacts/contracts/*/*.json`
- Deployment scripts: `scripts/*.js` or `.cjs`
- Frontend ABI copy (for browser): `frontend/src/Greeter.json`
- Hardhat config: `hardhat.config.js`

---

## Troubleshooting common issues

- "Named export 'ethers' not found" error
  - Hardhat is CommonJS; in ESM files import default: `import pkg from 'hardhat'; const { ethers } = pkg;` or keep scripts as `.cjs` and use `require('hardhat')`.

- MetaMask connection problems
  - Ensure MetaMask network is set to `http://127.0.0.1:8545` and accounts are imported (private keys shown by `npx hardhat node`).

- ABI / bundling issues in CRA
  - Browser bundles can't use Node built-ins (`fs`, `path`). Avoid top-level `fs` imports in modules that will run in the browser. Instead, keep Node-only code separate and import ABI JSON into the frontend codebase (put in `frontend/src`).

- Large or corrupted files
  - Keep `artifacts/`, `frontend/build/`, `node_modules/` in `.gitignore` (already done). If a file is corrupted, recreate it or replace the bad lines as a quick fix.

---

## Security & git hygiene checklist

- Add `.env.example` and never commit `.env`.
- Add private keys/keystores to `.gitignore` and use GitHub Secrets for CI.
- Add pre-commit hooks (Husky) to prevent accidental commits of secrets.
- Protect `main` branch; use feature branches + PRs.

---

## Roadmap: next practical steps (0 → 6 months guide)

0. Short-term (this week)
- Reproduce the working flow: compile, run node, deploy, run scripts, open frontend.
- Document the final addresses in `.env`.
- Commit repo changes and keep `main` safe.

1. Near-term (1-2 months)
- Write more tests for contracts.
- Explore Forking: use Hardhat/Alchemy to fork mainnet for testing stateful contract interactions.
- Prototype protocol-level changes in a dev chain or simulation.

2. Mid-term (2-4 months)
- Design the custom chain's additional features (consensus param changes, block time, built-in contracts).
- Research minimal full node implementations (e.g., OpenEthereum/Erigon forks or a custom L2 design).

3. Long-term (4-12 months)
- Build prototypes for custom chain features, run an integration testnet, and gather feedback.
- Explore funding: grants, bounties, or small freelancing jobs to raise cash.

---

## Appendix: useful commands

- Compile:
```
npx hardhat compile
```

- Test:
```
npx hardhat test
```

- Run local node:
```
npx hardhat node
```

- Run script:
```
npx hardhat run scripts/updateGreeting.cjs --network localhost
```

- Format JS (prettier):
```
npm install --save-dev prettier
npx prettier --write "**/*.js"
```

---

## Presentation variant (one-page executive summary)

(Separate section placed at top of the document; you can use this for sharing)

**Goal:** Fork Ethereum tooling to create a new chain that preserves EVM compatibility but adds targeted improvements (faster finality, lower gas for certain operations, or built-in governance primitives).

**Approach:** Build locally with Hardhat, validate changes by running a local node and deploying sample contracts, iterate on chain-level changes in a controlled dev environment, then grow to a testnet.

**Immediate wins:** prove the dev loop works: compile, deploy, interact (frontend), and automate via scripts.

---

## What I need from you to make this top-notch

- Any design notes or ideas you already have about the "unique blockchain features" (short bullet list). I will add them into the design section.
- Any additional files or diagrams you'd like included (e.g., architecture diagrams). I can create a simple diagram if you want.
- Confirmation on whether to include your contact or public profile in the document (optional).

---

End of summary
