import { io, Socket } from "socket.io-client";
import axios from "axios";
import chalk from "chalk";
import MCPConfig from "../../conf/MCP-config.js";

export async function setupDashboardSocket({
  logsBox,
  warningsBox,
  criticalBox,
  alertsBox,
  screen,
  updateBoxContents,
  idInput,
  passInput,
}) {
  // --- Socket.IO client for state/log updates ---
  const SOCKET_SERVER_URL = process.env.SERVER_BASE_URL;
  const authToken = async (): Promise<string> => {
    try {
      const res = await axios.post(
        `${SOCKET_SERVER_URL}/api/auth/leport`,
        {
          userId: idInput(),
          pass: passInput(),
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      if (!res.data || !res.data.token) {
        throw new Error(
          `[${MCPConfig.mcp_log_name}] Auth response missing token.`
        );
      }
      return res.data.token;
    } catch (err: any) {
      if (err.response) {
        throw new Error(
          `[${MCPConfig.mcp_log_name}] Auth failed: ${err.response.status} ${
            err.response.statusText
          }\n${JSON.stringify(err.response.data)}`
        );
      }
      throw new Error(
        `[${MCPConfig.mcp_log_name}] Auth error: ${err.message || err}`
      );
    }
  };
  let token: string;
  try {
    token = await authToken();
  } catch (err: any) {
    logsBox.log(
      `[${MCPConfig.mcp_log_name}] Authentication failed: ` +
        (err?.message || err)
    );
    token = "";
  }
  if (!token) {
    logsBox.log(
      `[${MCPConfig.mcp_log_name}] No token received, aborting connection.`
    );
    return;
  }
  let socket: Socket;
  try {
    socket = io(SOCKET_SERVER_URL, {
      query: {
        userId: idInput,
        token: token,
      },
    });
  } catch (e) {
    logsBox.log(
      `[${MCPConfig.mcp_log_name}] Socket.IO connection failed: ` +
        (e?.message || e)
    );
    return;
  }
  socket.on("connect", () => {
    try {
      logsBox.log(
        chalk.greenBright(
          `[${MCPConfig.mcp_log_name}] Connected to Socket.IO server.`
        )
      );
      screen.render();
    } catch (e) {
      logsBox.log(
        `[${MCPConfig.mcp_log_name}] Error on connect: ` + (e?.message || e)
      );
    }
  });
  socket.on("disconnect", () => {
    try {
      logsBox.log(
        chalk.redBright(
          `[${MCPConfig.mcp_log_name}] Disconnected from Socket.IO server.`
        )
      );
      screen.render();
    } catch (e) {
      logsBox.log(
        `[${MCPConfig.mcp_log_name}] Error on disconnect: ` + (e?.message || e)
      );
    }
  });
  socket.on("data_response", async (payload: any) => {
    // Payload format for creating a log:
    // {
    //   type: "log",
    //   data: "Your log message here"
    // }
    try {
      if (!payload || !payload.type) return;
      switch (payload.type) {
        case "state":
          await updateBoxContents(payload.data);
          screen.render();
          break;
        case "log":
          logsBox.log(payload.data);
          screen.render();
          break;
        case "warn":
          warningsBox.log(payload.data);
          screen.render();
          break;
        case "error":
          criticalBox.log(payload.data);
          screen.render();
          break;
        case "alert":
          alertsBox.log(payload.data);
          screen.render();
          break;
        default:
          break;
      }
    } catch (e) {
      logsBox.log(
        `[${MCPConfig.mcp_log_name}] Error handling data_response: ` +
          (e?.message || e)
      );
    }
  });
  try {
    socket.emit("request_state");
  } catch (e) {
    logsBox.log(
      `[${MCPConfig.mcp_log_name}] Error emitting request_state: ` +
        (e?.message || e)
    );
  }
}
