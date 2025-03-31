import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import fetch from "node-fetch";

// Create an MCP server
const server = new McpServer({
  name: "PaymanServer",
  version: "1.0.0",
  capabilities: {
    tools: {},
  }
});

let paymanApiKey = "";

// Tool to set API key
server.tool(
  "set-api-key",
  { apiKey: z.string().describe("The Payman API key to use for authentication") },
  async ({ apiKey }) => {
    paymanApiKey = apiKey;
    return {
      content: [{ 
        type: "text", 
        text: "Payman API key has been set successfully." 
      }]
    };
  }
);

// Tool to create a new payee
server.tool(
  "create-payee",
  {
    name: z.string().describe("Name of the payee"),
    type: z.string().default("TEST_RAILS").describe("Type of payment rails to use"),
    tags: z.array(z.string()).optional().describe("Optional tags for the payee")
  },
  async ({ name, type, tags = [] }) => {
    if (!paymanApiKey) {
      return {
        content: [{ 
          type: "text", 
          text: "API key has not been set. Please use the set-api-key tool first." 
        }],
        isError: true
      };
    }

    try {
      const response = await fetch('https://agent.payman.ai/api/payments/payees', {
        method: 'POST',
        headers: {
          'x-payman-api-secret': paymanApiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ type, name, tags })
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          content: [{ 
            type: "text", 
            text: `Error creating payee: ${JSON.stringify(data)}` 
          }],
          isError: true
        };
      }

      return {
        content: [{ 
          type: "text", 
          text: `Payee created successfully: ${JSON.stringify(data)}` 
        }]
      };
    } catch (error) {
      return {
        content: [{ 
          type: "text", 
          text: `Failed to create payee: ${error instanceof Error ? error.message : String(error)}` 
        }],
        isError: true
      };
    }
  }
);

// Tool to send a payment
server.tool(
  "send-payment",
  {
    payeeId: z.string().describe("ID of the payee to send payment to"),
    amountDecimal: z.number().positive().describe("Amount to send (in decimal)"),
    memo: z.string().optional().describe("Optional memo for the payment"),
    metadata: z.record(z.any()).optional().describe("Optional metadata for the payment")
  },
  async ({ payeeId, amountDecimal, memo = "", metadata = {} }) => {
    if (!paymanApiKey) {
      return {
        content: [{ 
          type: "text", 
          text: "API key has not been set. Please use the set-api-key tool first." 
        }],
        isError: true
      };
    }

    try {
      const response = await fetch('https://agent.payman.ai/api/payments/send-payment', {
        method: 'POST',
        headers: {
          'x-payman-api-secret': paymanApiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ payeeId, amountDecimal, memo, metadata })
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          content: [{ 
            type: "text", 
            text: `Error sending payment: ${JSON.stringify(data)}` 
          }],
          isError: true
        };
      }

      return {
        content: [{ 
          type: "text", 
          text: `Payment sent successfully: ${JSON.stringify(data)}` 
        }]
      };
    } catch (error) {
      return {
        content: [{ 
          type: "text", 
          text: `Failed to send payment: ${error instanceof Error ? error.message : String(error)}` 
        }],
        isError: true
      };
    }
  }
);

// Tool to search for payees
server.tool(
  "search-payees",
  {},
  async () => {
    if (!paymanApiKey) {
      return {
        content: [{ 
          type: "text", 
          text: "API key has not been set. Please use the set-api-key tool first." 
        }],
        isError: true
      };
    }

    try {
      const response = await fetch('https://agent.payman.ai/api/payments/search-payees', {
        method: 'GET',
        headers: {
          'x-payman-api-secret': paymanApiKey,
          'content-type': 'application/json'  
        }
      });

      // Handle the response
      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (e) {
          errorData = await response.text();
        }
        
        return {
          content: [{ 
            type: "text", 
            text: `Error searching payees (Status ${response.status}): ${JSON.stringify(errorData)}` 
          }],
          isError: true
        };
      }

      const data = await response.json();
      return {
        content: [{ 
          type: "text", 
          text: `Payees found: ${JSON.stringify(data, null, 2)}` 
        }]
      };
    } catch (error) {
      return {
        content: [{ 
          type: "text", 
          text: `Failed to search payees: ${error instanceof Error ? error.message : String(error)}` 
        }],
        isError: true
      };
    }
  }
);


//Get balance
server.tool(
  "get-balance",
  {},
  async () => {
    if (!paymanApiKey) {
      return {
        content: [{ 
          type: "text", 
          text: "API key has not been set. Please use the set-api-key tool first." 
        }],
        isError: true
      };
    }

    try {
      const response = await fetch('https://agent.payman.ai/api/balances/currencies/TSD', {
        method: 'GET',
        headers: {
          'x-payman-api-secret': paymanApiKey,
          'content-type': 'application/json'  
        }
      });

      // Handle the response
      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (e) {
          errorData = await response.text();
        }
        
        return {
          content: [{ 
            type: "text", 
            text: `Error fetching balance (Status ${response.status}): ${JSON.stringify(errorData)}` 
          }],
          isError: true
        };
      }

      const data = await response.json();
      return {
        content: [{ 
          type: "text", 
          text: `Current Balance:  ${data}` 
        }]
      };
    } catch (error) {
      return {
        content: [{ 
          type: "text", 
          text: `Failed to get balance: ${error instanceof Error ? error.message : String(error)}` 
        }],
        isError: true
      };
    }
  }
);

// Start the server with stdio transport
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Payman MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});