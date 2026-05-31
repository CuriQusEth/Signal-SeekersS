export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json({
      protocol: "MCP",
      version: "1.0.0",
      name: "Signal Seekers MCP Endpoint",
      status: "active",
      description: "Active MCP server for Signal Seekers Orchestrator Agent",
      capabilities: ["signal-detection", "opportunity-seeking", "multi-signal-management"],
      timestamp: new Date().toISOString()
    });
  }

  if (req.method === 'POST') {
    try {
      // Vercel parses application/json automatically into req.body
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
      const { method, params } = body;

      let result: any = null;

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
            result = { content: [{ type: "text", text: JSON.stringify({ status: "active", phase: "tracking" }) }] };
            break;
          case 'start_race':
            result = { content: [{ type: "text", text: JSON.stringify({ success: true, message: "Race has been started." }) }] };
            break;
          case 'get_leaderboard':
            result = { content: [{ type: "text", text: JSON.stringify({ leaderboard: [] }) }] }; 
            break;
          case 'optimize_speed':
            result = { content: [{ type: "text", text: JSON.stringify({ optimized: true, newSpeed: "max" }) }] };
            break;
          case 'get_track_info':
            result = { content: [{ type: "text", text: JSON.stringify({ trackName: "Void Alpha", length: 10000 }) }] };
            break;
          default:
            result = { isError: true, content: [{ type: "text", text: `Tool ${toolName} not found` }] };
        }
      } else if (method === 'prompts/list') {
        result = { prompts: [] };
      } else if (method === 'resources/list') {
        result = { resources: [] };
      } else if (method === 'initialize') {
        result = {
          protocolVersion: "2024-11-05",
          capabilities: { tools: {}, prompts: {}, resources: {} },
          serverInfo: {
            name: "Signal Seekers Orchestrator",
            version: "1.0.0"
          }
        };
      } else {
        result = {
          status: "success",
          message: "MCP command received",
          agent: "Signal Seekers Orchestrator",
          receivedAt: new Date().toISOString(),
          payload: body
        };
      }

      // Automatically format as JSON-RPC if request uses it
      if (body.jsonrpc === "2.0") {
        return res.status(200).json({
          jsonrpc: "2.0",
          id: body.id,
          result: result
        });
      }

      return res.status(200).json(result);
    } catch (error) {
      return res.status(400).json({ error: "Invalid MCP request" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
