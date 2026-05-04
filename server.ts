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
