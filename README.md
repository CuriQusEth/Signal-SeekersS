# Signal Seekers

**Signal Seekers** is a frequency scanner and deep space anomaly detection game. Dive deep into the void, lock onto cryptic signals, and uncover the mysteries hidden within the static.

## Project Overview

Welcome to the **Signal Seekers Orchestrator**. This project powers an ERC-8004 compliant AI agent for the Signal Seekers platform. The orchestrator is designed for precision tracking, deep space scanning, and automated anomaly responses. It autonomously monitors the network to provide competitive advantages, unlocking deep-void data fragments securely.

### Key Capabilities
- Signal Detection
- Opportunity Seeking
- Multi-Signal Management
- Trading Signals
- Automation
- MCP Command Execution

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS
- **Backend / Agent API**: Next.js 14 (App Router)
- **Web3 Integrations**: EIP-155 / EIP-8004 standard compatibility (Base Network)

## MCP Connection Guide

The agent is fully integrated with the **Model Context Protocol (MCP)**, allowing for active command execution via standardized API routes. 

- **Endpoint**: `https://signal-seekers-s.vercel.app/api/mcp`
- **Supported Methods**: `GET`, `POST`
- **Available Tools**:
  - `get_race_status`
  - `start_race`
  - `get_leaderboard`
  - `optimize_speed`
  - `get_track_info`

To test the MCP connection locally or remotely, send a generic `POST` request or use an MCP-compliant client matching the tools listed above.

## Agent Registration Info

The agent serves a public `agent-card.json` allowing for decentralized discovery and Agent-to-Agent (A2A) handshakes.

- **Agent Name**: Signal Seekers Orchestrator
- **Standard**: ERC-8004 Registration (v1)
- **Supported Chains**: `eip155:8453` (Base)
- **Manifest Location**: `https://signal-seekers-s.vercel.app/.well-known/agent-card.json`

## How to Run Locally

First, ensure you have Node.js and `npm` installed.

1. **Clone the repository:**
   ```bash
   git clone [repository-url]
   cd signal-seekers
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```
