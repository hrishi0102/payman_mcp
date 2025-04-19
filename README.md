# Payman AI MCP Server

[![smithery badge](https://smithery.ai/badge/@hrishi0102/payman_mcp)](https://smithery.ai/server/@hrishi0102/payman_mcp)

MCP server that provides easy way to Payman AI's API's and let's users create payees, search payees, send payments and get balances using prompts.


## Prerequisites

-   [Node.js](https://nodejs.org/) (v14 or higher)
-   [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
-   Git

## Installation

### Installing via Smithery

To install Payman AI for Claude Desktop automatically via [Smithery](https://smithery.ai/server/@hrishi0102/payman_mcp):

```bash
npx -y @smithery/cli install @hrishi0102/payman_mcp --client claude
```

### Manual Installation
1. Clone the repository:

    ```bash
    git clone https://github.com/hrishi0102/payman_mcp.git
    ```


2. Install dependencies:
    ```bash
    npm install
    # OR
    yarn install
    ```

## Building the Project

Build the TypeScript code into JavaScript:

```bash
npm run build
# OR
yarn build
```

## Checking Server

Check if the server is properly setup:

```bash
node /ABSOLUTE/PATH/TO/PARENT/FOLDER/payman-mcp/build/payman-server.js
```

If everything is good, you can now add the Payman MCP server to any client.

- For Claude Desktop: [Here](https://modelcontextprotocol.io/quickstart/server#claude-for-desktop-integration-issues)
- For Cursor: [Here](https://docs.cursor.com/context/model-context-protocol)
