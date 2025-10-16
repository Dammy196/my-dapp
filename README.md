# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a Hardhat Ignition module that deploys that contract.

Try running some of the following tasks:

```shell
# my-dapp

A small Hardhat + React (CRA) dApp demonstrating local smart contract development, testing, deployment, and a React front end that interacts with deployed contracts.

This repo contains:

- `contracts/` – Solidity contracts (example: `Greeter.sol`, `Counter.sol`, `Lock.sol`).
- `scripts/` – Node/Hardhat scripts for deploying and interacting with contracts. There's a CommonJS runner `scripts/updateGreeting.cjs` that updates the Greeter greeting locally.
- `artifacts/` and `cache/` – build artifacts produced by Hardhat (ignored by git).
- `frontend/` – a Create React App front end that imports contract ABIs and interacts with deployed contracts.
- `ignition/` – Hardhat Ignition modules for local deployments.

## Quick start (assumes Node 18+)

1. Install dependencies

```bash
npm install
cd frontend && npm install
```

2. Start a local Hardhat node (in a separate terminal)

```bash
npx hardhat node
```

3. Deploy locally (using scripts or Ignition)

```bash
# example using Ignition
npx hardhat ignition deploy ./ignition/modules/Lock.js --network localhost

# or run your deploy scripts (if any)
# npx hardhat run scripts/deploy.js --network localhost
```

4. Run frontend

```bash
cd frontend
npm start
```

## Useful scripts

- Start local node: `npx hardhat node`
- Run a script (example):

```bash
# Use the CommonJS updateGreeting script and provide GREETER_ADDRESS either via env or CLI
# Using env (PowerShell):
$env:GREETER_ADDRESS="0xYourDeployedAddress"
npx hardhat run scripts/updateGreeting.cjs --network localhost

# Or pass as argument (simple argv support required in script):
node scripts/updateGreeting.cjs 0xYourDeployedAddress
```

## Environment variables

Copy `.env.example` to `.env` and fill in the values you need. `.env` is ignored by git. Example variables:

- `RPC_URL` — JSON-RPC endpoint
- `GREETER_ADDRESS` — address of deployed Greeter contract
- `DEPLOYER_PRIVATE_KEY` — private key for automated deployments (keep secret)

## Security notes

- Never commit `.env` or private keys. Use `.env.example` (checked in) to show which keys/configs are required.
- For CI/CD and remote deployments, store secrets in GitHub Actions Secrets (or equivalent) and never embed secrets into repo.
- If you accidentally commit a secret, rotate it immediately and remove it from git history (use `git filter-repo` or BFG).

## Development tips

- Keep `node_modules` and build artifacts out of git (covered by `.gitignore`).
- Add a GitHub Action to run `npx hardhat test` and frontend tests on PRs.
- Use branch protection rules (require PR review + passing checks) before merging to `main`.

## Contributing

Open an issue or submit a pull request. If adding a feature that requires new environment variables, update `.env.example` and the README.

## License

Add a license file if you plan to share the project publicly.