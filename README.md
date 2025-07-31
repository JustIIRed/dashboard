# MCP Dashboard 🚦

**MCP** is a modular, personalized terminal dashboard that connects to your server via WebSocket after a successful login and access token retrieval.  
Enjoy real-time monitoring, live logs, alerts, and interactive panels—all in your terminal, all in one place.

---

## Features ✨

- 📊 Real-time server status and metrics  
- 📜 Live logs, warnings, and critical alerts  
- 🔌 API and client connection monitoring  
- 📝 Markdown info panel for documentation or notes  
- 🧭 Interactive navigation between dashboard panels  

---

## Getting Started 🚀

1. **Clone the repository:**

   ```sh
   git clone https://github.com/JustIIRed/dashboard.git
   cd dashboard
   ```

2. **Build and install dependencies:**

   ```sh
   npm run build
   ```

   This will install all dependencies, compile the project, and copy configuration files.  
   If a `.env` file does not exist, one will be created from `src/conf/env.txt`.  
   If `.env` already exists, a `.env.template` will be created instead.  
   Simply edit the generated `.env` file (or `.env.template`) with your own values as needed.

3. **Configure your environment variables:**

   - Open the `.env` file (or `.env.template` if `.env` already existed).
   - ✏️ Change the values (such as `SERVER_BASE_URL`) to match your server and environment.

4. **Authenticate:**  
   On startup, enter your **Username** and **Password** when prompted. 🔑

> **Note:**  
> If you make any changes to the TypeScript files (in `src/`), you must run `npm run build` again to recompile and apply your changes. 🛠️

---

## Configuration ⚙️

- The dashboard will look for a markdown file at `conf/dashboard.md` for the info panel.  
  This file is **optional**—if it does not exist, the dashboard will still run, but the info panel will display a default message.
- You can further customize the dashboard by editing the configuration file at `src/conf/MCP-config.ts`.  
  For example, you can change the dashboard's display name, log name, and add more settings as needed.

  ```typescript
  // src/conf/MCP-config.ts
  export default {
    mcp_display_name: "MCP Dashboard",
    mcp_log_name: "MCP",
    // Add more configuration options here
  };
  ```

- **Server State Configuration:**  
  The file `src/conf/serverState-config.ts` defines the *exact* fields your dashboard expects to receive from your server's state API.  
  Each field (such as `isMongoOnline`, `isDiscordClientOnline`, etc.) should match a primitive value (boolean, string, or number) in your server's response.  
  The dashboard will display a status line for each field you define here.

  **Naming Convention:**  
  - Status fields should follow the format `is<Name>Online` (e.g., `isMCPLogOnline`).  
    The dashboard will display this as `MCPLog` in the UI.
  - To add a new status, use the format `is<Name>Online: boolean` in the appropriate section.  
    For example, to add a new service called "MyService", add:
    ```typescript
    isMyServiceOnline: false,
    ```
    This will display as `MyService` in the dashboard.
  - The dashboard strips the leading `is` and trailing `Online` to generate the label.
  - If you add or remove fields in this config, you must ensure your server sends matching fields in its state response.
  - Only fields with primitive values (boolean, string, number) are supported for status display.

  **Example:**

  ```typescript
  // src/conf/serverState-config.ts
  export default {
    serverStatus: {
      isRunning: false,
      uptime: "",
      heapUsed: "",
      heapTotal: "",
      rss: "",
    },
    dbStatus: {
      isMongoOnline: false,
      isRedisOnline: false,
      // Add a new DB status:
      isMyDatabaseOnline: false, // Will display as "MyDatabase"
    },
    apiStatus: {
      isSpotifyApiOnline: false,
      isTwitchApiOnline: false,
      // Add or remove APIs as needed
    },
    clientStatus: {
      isDiscordClientOnline: false,
      isTwitchChatListenerOnline: false,
      // Add or remove clients as needed
    },
    connectionStatus: {
      isDiscordWSOnline: false,
      reqsPerSec: 0,
      sockets: 0,
      // Add or remove connection metrics as needed
    },
    mcpServices: {
      isMCPOnline: false,
      isMCPLogOnline: false,
      isMCPDashboardOnline: false,
      // Add or remove MCP services as needed
    },
  };
  ```

  > **Note:**  
  > If you add or remove fields in `serverState-config.ts`, your server must send matching fields in its state response.  
  > The dashboard will only display fields defined here and will use the naming convention to generate user-friendly labels.

- Server connection and authentication details are handled via prompts and environment variables.

---

## About 🧩

MCP is a flexible, extensible dashboard for monitoring and interacting with your server environment, all from the comfort of your terminal.

---
