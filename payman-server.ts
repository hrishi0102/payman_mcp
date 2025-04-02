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

//Tool to create Test Payee
server.tool(
  "create-test-rails-payee",
  {
    name: z.string().describe("Name of the payee"),
    type: z.literal("TEST_RAILS").default("TEST_RAILS").describe("Type of payment rails to use"),
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
          text: `TEST_RAILS payee created successfully: ${JSON.stringify(data)}` 
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

// Tool to create a US_ACH payee
server.tool(
  "create-us-ach-payee",
  {
    type: z.literal("US_ACH").default("US_ACH").describe("Type of payment rails to use"),
    accountType: z.enum(["checking", "savings"]).describe("The type of account (checking or savings)"),
    accountNumber: z.string().describe("The bank account number for the account"),
    routingNumber: z.string().describe("The routing number of the bank"),
    accountHolderName: z.string().describe("The name of the account holder"),
    accountHolderType: z.enum(["individual", "business"]).describe("The type of the account holder"),
    name: z.string().describe("The name you wish to associate with this payee for future lookups"),
    tags: z.array(z.string()).optional().describe("Optional labels you wish to assign to this payee"),
    contactDetails: z.object({
      email: z.string().email().optional().describe("The email address of the payee contact"),
      phoneNumber: z.string().optional().describe("The phone number of the payee contact"),
      address: z.object({
        line1: z.string().optional().describe("Address line 1"),
        line2: z.string().optional().describe("Address line 2"),
        city: z.string().optional().describe("City"),
        state: z.string().optional().describe("State"),
        postalCode: z.string().optional().describe("Postal code"),
        country: z.string().optional().describe("Country")
      }).optional().describe("The address of the payee contact")
    }).optional().describe("Contact details for this payee")
  },
  async (params) => {
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
        body: JSON.stringify(params)
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          content: [{ 
            type: "text", 
            text: `Error creating US_ACH payee: ${JSON.stringify(data)}` 
          }],
          isError: true
        };
      }

      return {
        content: [{ 
          type: "text", 
          text: `US_ACH payee created successfully: ${JSON.stringify(data)}` 
        }]
      };
    } catch (error) {
      return {
        content: [{ 
          type: "text", 
          text: `Failed to create US_ACH payee: ${error instanceof Error ? error.message : String(error)}` 
        }],
        isError: true
      };
    }
  }
);

// Tool to create a CRYPTO_ADDRESS payee
server.tool(
  "create-crypto-payee",
  {
    type: z.literal("CRYPTO_ADDRESS").default("CRYPTO_ADDRESS").describe("Type of payment rails to use"),
    address: z.string().describe("The cryptocurrency address to send funds to"),
    chain: z.string().describe("The blockchain to use for the transaction"),
    currency: z.string().describe("The currency/token to use for the transaction"),
    name: z.string().describe("The name you wish to associate with this payee for future lookups"),
    tags: z.array(z.string()).optional().describe("Optional labels you wish to assign to this payee"),
    contactDetails: z.object({
      email: z.string().email().optional().describe("The email address of the payee contact"),
      phoneNumber: z.string().optional().describe("The phone number of the payee contact"),
      address: z.object({
        line1: z.string().optional().describe("Address line 1"),
        line2: z.string().optional().describe("Address line 2"),
        city: z.string().optional().describe("City"),
        state: z.string().optional().describe("State"),
        postalCode: z.string().optional().describe("Postal code"),
        country: z.string().optional().describe("Country")
      }).optional().describe("The address of the payee contact")
    }).optional().describe("Contact details for this payee")
  },
  async (params) => {
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
        body: JSON.stringify(params)
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          content: [{ 
            type: "text", 
            text: `Error creating CRYPTO_ADDRESS payee: ${JSON.stringify(data)}` 
          }],
          isError: true
        };
      }

      return {
        content: [{ 
          type: "text", 
          text: `CRYPTO_ADDRESS payee created successfully: ${JSON.stringify(data)}` 
        }]
      };
    } catch (error) {
      return {
        content: [{ 
          type: "text", 
          text: `Failed to create CRYPTO_ADDRESS payee: ${error instanceof Error ? error.message : String(error)}` 
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
    walletId : z.string().optional().describe("The ID of the specific wallet from which to send the funds"),
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

// Tool to search for payees with optional query parameters
server.tool(
  "search-payees",
  {
    name: z.string().optional().describe("The name of the payee to search for (partial, case-insensitive match)"),
    contactEmail: z.string().email().optional().describe("The contact email to search for"),
    contactPhoneNumber: z.string().optional().describe("The contact phone number to search for"),
    contactTaxId: z.string().optional().describe("The contact tax id to search for"),
    accountNumber: z.string().optional().describe("The US Bank account number to search for"),
    routingNumber: z.string().optional().describe("The US Bank routing number to search for"),
    agentReference: z.string().optional().describe("The Payman agent reference (id or handle) to search for"),
    cryptoAddress: z.string().optional().describe("The crypto address to search for"),
    cryptoCurrency: z.string().optional().describe("The crypto currency to search for"),
    cryptoChain: z.string().optional().describe("The crypto chain to search for")
  },
  async (params) => {
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
      // Build query parameters if any are provided
      const queryParams = Object.entries(params)
        .filter(([_, value]) => value !== undefined)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
        .join('&');
      
      // Construct the URL with query parameters if present
      const url = queryParams 
        ? `https://agent.payman.ai/api/payments/search-payees?${queryParams}`
        : 'https://agent.payman.ai/api/payments/search-payees';
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'x-payman-api-secret': paymanApiKey,
          'Content-Type': 'application/json'
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
      
      // If search parameters were provided, include them in the response
      const searchDescription = Object.keys(params).length > 0
        ? `Search results for criteria: ${JSON.stringify(params)}`
        : "All payees:";
      
      return {
        content: [{ 
          type: "text", 
          text: `${searchDescription}\n\n${JSON.stringify(data, null, 2)}` 
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