// MAIN SERVER STATE CONFIGURATION
// This file defines the server state configuration for monitoring various components of the system.
interface boolStatusBox {
  [key: string]: boolean;
}
interface ConnectionStatus {
  [key: string]: number | boolean;
}
interface ServerStatus {
  isRunning: boolean;
  uptime: string | number;
  heapUsed: string | number;
  heapTotal: string | number;
  rss: string | number;
}
// Format CUSTOM fields as follows < is<name>Online >
export default {
  serverStatus: <ServerStatus>{
    isRunning: false,
    uptime: "",
    heapUsed: "",
    heapTotal: "",
    rss: "",
  },
  dbStatus: <boolStatusBox>{
    isMongoOnline: false,
    isRedisOnline: false,
    isTsRedisOnline: false,
  },
  apiStatus: <boolStatusBox>{
    isSpotifyApiOnline: false,
    isTwitchApiOnline: false,
  },
  clientStatus: <boolStatusBox>{
    isDiscordClientOnline: false,
    isTwitchChatListenerOnline: false,
    isTwitchChatMimicOnline: false,
  },
  connectionStatus: <ConnectionStatus>{
    isDiscordWSOnline: false,
    reqsPerSec: 0,
    sockets: 0,
  },
  mcpServices: <boolStatusBox>{
    isMCPOnline: false,
    isMCPLogOnline: false,
    isMCPDashboardOnline: false,
  },
};
