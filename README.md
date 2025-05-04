# Payman API MCP Server

An MCP (Model Context Protocol) server that provides seamless integration with Payman AI's payment APIs, allowing AI assistants to create payees, search for existing payees, send payments, and check balances through natural language.

## Overview

This MCP server exposes Payman AI's payment functionality as tools that can be used by LLM applications such as Claude. It enables AI assistants to perform the following operations:

- Set API keys for authentication
- Create different types of payees (TEST_RAILS, US_ACH, CRYPTO_ADDRESS)
- Send payments to registered payees
- Search for payees based on various criteria
- Check account balances

This implementation follows the Model Context Protocol (MCP) standard, ensuring compatibility with any MCP-compatible client.

## Features

- **Secure API Authentication**: Manage API keys securely within the session
- **Multiple Payee Types**:
  - TEST_RAILS payees for testing
  - US_ACH payees for US bank transfers
  - CRYPTO_ADDRESS payees for cryptocurrency transactions
- **Payment Operations**:
  - Send payments with custom amounts and memos
  - Retrieve current balances
- **Search Capabilities**:
  - Search payees by name, contact information, account details, etc.
- **Error Handling**: Comprehensive error handling for all API operations
- **Secure Transports**: Supports both stdio and SSE (Server-Sent Events) transports

## Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- A Payman AI API key

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/payman-mcp-server.git
   cd payman-mcp-server
   ```

2. Install dependencies:

   ```bash
   npm install
   # OR
   yarn install
   ```

3. Build the TypeScript code:

   ```bash
   npm run build
   # OR
   yarn build
   ```

## Configuration

The server does not require any configuration files. API keys are set at runtime using the `set-api-key` tool.

## Running the Server

### Standard I/O Mode (for Claude Desktop, etc.)

Run the server in stdio mode, which is compatible with Claude Desktop and similar MCP clients:

Check if the server is properly setup:

```bash
node /ABSOLUTE/PATH/TO/PARENT/FOLDER/payman-mcp/build/payman-server.js
```

If everything is good, you can now add the Payman MCP server to any client.

- For Claude Desktop: [Here](https://modelcontextprotocol.io/quickstart/server#claude-for-desktop-integration-issues)
- For Cursor: [Here](https://docs.cursor.com/context/model-context-protocol)

### Server-Sent Events (SSE) Mode (for web integration)

To run the server with SSE transport (requires additional dependencies: `express` and `cors`):

```bash
node build/payman-server-sse.js
```

This will start a web server on port 3001 with the following endpoints:

- `/sse` - The SSE endpoint for server-to-client communication
- `/messages` - The endpoint for client-to-server messages

## Integrating with MCP Clients

### Claude Desktop

1. Open your Claude Desktop configuration file:

   - macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - Windows: `%APPDATA%\Claude\claude_desktop_config.json`

2. Add the server configuration:

   ```json
   {
     "mcpServers": {
       "payman": {
         "command": "node",
         "args": ["/ABSOLUTE/PATH/TO/payman-mcp-server/build/payman-server.js"]
       }
     }
   }
   ```

3. Restart Claude Desktop

### Other MCP Clients

For other MCP clients like Cursor, refer to their specific documentation for adding MCP servers.

## Usage Guide

Once the server is connected to an MCP client, you can use the following tools:

### Setting the API Key

First, you need to set your Payman API key:

```
Please use the set-api-key tool with my Payman API key: YOUR_API_KEY_HERE
```

### Creating Payees

#### Test Rails Payee

```
Create a test payee named "Test User" with the tag "test"
```

#### US ACH Payee

```
Create a US ACH payee with these details:
- Name: John Doe
- Account Type: checking
- Account Number: 12345678
- Routing Number: 123456789
- Account Holder Name: John Doe
- Account Holder Type: individual
```

#### Crypto Payee

```
Create a crypto payee with:
- Name: Crypto Wallet
- Address: 0x1234567890abcdef
- Chain: ethereum
- Currency: ETH
```

### Sending Payments

```
Send a payment of 100 to payee ID "pay_123abc" with the memo "Monthly service"
```

### Searching for Payees

```
Search for all payees with the name "John"
```

### Checking Balance

```
What's my current balance?
```

## Tool Reference

### `set-api-key`

Sets the Payman API key for authentication.

- **Parameters**:
  - `apiKey` (string): The Payman API key

### `create-test-rails-payee`

Creates a TEST_RAILS payee for testing.

- **Parameters**:
  - `name` (string): Name of the payee
  - `type` (string): "TEST_RAILS" (default)
  - `tags` (string[]): Optional tags for the payee

### `create-us-ach-payee`

Creates a US_ACH payee for bank transfers.

- **Parameters**:
  - `type` (string): "US_ACH" (default)
  - `accountType` (enum): "checking" or "savings"
  - `accountNumber` (string): The bank account number
  - `routingNumber` (string): The routing number
  - `accountHolderName` (string): The name of the account holder
  - `accountHolderType` (enum): "individual" or "business"
  - `name` (string): Name for this payee
  - Plus additional optional parameters (tags, contactDetails)

### `create-crypto-payee`

Creates a CRYPTO_ADDRESS payee for cryptocurrency payments.

- **Parameters**:
  - `type` (string): "CRYPTO_ADDRESS" (default)
  - `address` (string): The cryptocurrency address
  - `chain` (string): The blockchain to use
  - `currency` (string): The cryptocurrency/token
  - `name` (string): Name for this payee
  - Plus additional optional parameters (tags, contactDetails)

### `send-payment`

Sends a payment to a payee.

- **Parameters**:
  - `payeeId` (string): ID of the payee to pay
  - `amountDecimal` (number): Amount to send
  - `walletId` (string, optional): Specific wallet to use
  - `memo` (string, optional): Payment memo
  - `metadata` (object, optional): Additional metadata

### `search-payees`

Search for payees based on various criteria.

- **Parameters**: Multiple optional search parameters
  - `name`, `contactEmail`, `accountNumber`, etc.

### `get-balance`

Retrieves the current account balance.

- **Parameters**: None

## Error Handling

All tools include proper error handling and will return descriptive error messages if:

- The API key has not been set
- API requests fail
- Invalid parameters are provided
- Network issues occur

## Security Considerations

- API keys are stored in memory for the duration of the session
- The server does not persist any credentials to disk
- All requests to the Payman API use proper authorization headers

- [Model Context Protocol](https://modelcontextprotocol.io/) for the MCP specification
- [Payman AI](https://payman.ai/) for the payment API
- [Zod](https://github.com/colinhacks/zod) for input validation
