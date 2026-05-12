# Signal Seekers

**Signal Seekers** is a frequency scanner and deep space anomaly detection game. Dive deep into the void, lock onto cryptic signals, and uncover the mysteries hidden within the static.

## Features

- **Signal Scanner HUD**: A fully specialized UI for searching and locking onto frequencies.
- **Deep Void Exploration**: Lock onto targets to increase your depth and recover lost signals.
- **Data Fragments & Upgrades**: Gain DATA fragments for decoding signals and use them to upgrade your hardware.
- **Codex**: Track the decrypted messages and logs you uncover across your journey.
- **On-Chain Leaderboard**: Submit your highest depth and accumulated scores to an on-chain leaderboard.
- **ERC-8004 AI Agent Integration**: Equipped with an MCP-enabled agent orchestrator for multi-signal management and signal detection.

## Development

The project is built with React, Vite, and tailwind CSS on the frontend, with an Express backend for managing leaderboards, API endpoints, and SIWE (Sign-In with Ethereum) capabilities.

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

## Agent Configuration
The application exposes a standard `agent-card.json` pointing to an MCP orchestrator.
- **Agent Card**: `/.well-known/agent-card.json`
- **MCP Endpoint**: `/api/mcp`
- **Agent Info**: `/api/agent`
