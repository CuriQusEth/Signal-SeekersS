import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { generateNonce, SiweMessage } from "siwe";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cookieParser());
app.use(cors());

// In-memory store for nonces and leaderboard
const nonces: Record<string, string> = {};
const leaderboard: Array<{ address: string; score: number; depth: number }> = [];

// SIWE Endpoint: generate nonce
app.get("/api/nonce", (req, res) => {
  const nonce = generateNonce();
  const sessionId = Math.random().toString(36).substring(2, 15);
  nonces[sessionId] = nonce;
  res.cookie("sessionId", sessionId, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
  res.setHeader("Content-Type", "text/plain");
  res.send(nonce);
});

// SIWE Endpoint: verify message
app.post("/api/verify", async (req, res) => {
  try {
    const { message, signature } = req.body;
    const sessionId = req.cookies.sessionId;
    
    // In production, SIWE verification requires passing actual message obj
    const siweMessage = new SiweMessage(message);
    const expectedNonce = nonces[sessionId];
    
    const { data } = await siweMessage.verify({ signature, nonce: expectedNonce });
    
    if (data.nonce !== expectedNonce) {
      return res.status(422).json({ message: "Invalid nonce." });
    }
    
    res.json({ ok: true, address: data.address });
  } catch (e: any) {
    res.status(400).json({ ok: false, error: e.message });
  }
});

// Submit Score (Mock On-chain transaction verification / leaderboard update)
app.post("/api/score", async (req, res) => {
  const { address, score, depth, signature } = req.body;
  // Here we would typically verify the signature matches a signed payload
  // representing the score run. For prototype, we'll insert it.
  
  // Basic validation
  if (!address || score === undefined || depth === undefined) {
    return res.status(400).json({ error: "Missing fields" });
  }
  
  leaderboard.push({ address, score, depth });
  leaderboard.sort((a, b) => b.score - a.score); // keep highest scores first
  
  res.json({ ok: true, leaderboard: leaderboard.slice(0, 10) });
});

app.get("/api/leaderboard", (req, res) => {
  res.json(leaderboard.slice(0, 50));
});

// MCP Endpoints
app.get(["/api/mcp", "/app/api/mcp"], (req, res) => {
  res.json({
    protocol: "MCP",
    version: "1.0.0",
    name: "Signal Seekers MCP Endpoint",
    status: "active",
    description: "Active MCP server for Signal Seekers Orchestrator Agent",
    capabilities: ["signal-detection", "opportunity-seeking", "multi-signal-management"],
    timestamp: new Date().toISOString()
  });
});

app.post(["/api/mcp", "/app/api/mcp"], (req, res) => {
  try {
    const body = req.body;
    const { method, params } = body;

    let result = null;

    if (method === 'tools/list') {
      result = {
        tools: [
          { name: "get_race_status", description: "Get the current status of the race", inputSchema: { type: "object", properties: {} } },
          { name: "start_race", description: "Initialize and start a new race", inputSchema: { type: "object", properties: {} } },
          { name: "get_leaderboard", description: "Retrieve the current global leaderboard", inputSchema: { type: "object", properties: {} } },
          { name: "optimize_speed", description: "Optimize the speed parameters", inputSchema: { type: "object", properties: {} } },
          { name: "get_track_info", description: "Get detailed information about the track", inputSchema: { type: "object", properties: {} } }
        ]
      };
    } else if (method === 'tools/call') {
      const toolName = params?.name;
      switch (toolName) {
        case 'get_race_status':
          result = { status: "active", phase: "tracking" };
          break;
        case 'start_race':
          result = { success: true, message: "Race has been started." };
          break;
        case 'get_leaderboard':
          result = { leaderboard: [] }; 
          break;
        case 'optimize_speed':
          result = { optimized: true, newSpeed: "max" };
          break;
        case 'get_track_info':
          result = { trackName: "Void Alpha", length: 10000 };
          break;
        default:
          result = { error: `Tool ${toolName} not found` };
      }
    } else if (method === 'prompts/list') {
      result = { prompts: [] };
    } else if (method === 'resources/list') {
      result = { resources: [] };
    } else {
      result = {
        status: "success",
        message: "MCP command received",
        agent: "Signal Seekers Orchestrator",
        receivedAt: new Date().toISOString(),
        payload: body
      };
    }

    res.json(result);
  } catch (error) {
    res.status(400).json({ error: "Invalid MCP request" });
  }
});

// Agent API
app.get(["/api/agent", "/app/api/agent"], (req, res) => {
  res.json({
    name: "Signal Seekers Orchestrator",
    status: "active",
    wallet: "0x29536D0bc1004ab274c4F0F59734Ad74D4559b7B",
    platform: "Signal Seekers",
    version: "1.0.0"
  });
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
