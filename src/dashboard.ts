// @ts-nocheck
import dotenv from "dotenv";
dotenv.config();
import blessed from "neo-blessed";
import util from "util";
import axios from "axios";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import Grid from "./libs/blessed-contrib-fork/grid.js";
import chalk from "chalk";
import MCPConfig from "./conf/MCP-config.js";
import serverStateConfig from "./conf/serverState-config.js";
import * as Views from "./views/index.js";
import { setupDashboardSocket } from "./client/sockets/dashSocket.js"; // <-- import the new function
function logErrorToFile(error: any) {
  try {
    const errorLogPath = path.join(__dirname, "dashboard-error.log");
    const timestamp = new Date().toISOString();
    const message = `[${timestamp}] ${
      error?.stack || error?.message || error
    }\n`;
    fs.appendFileSync(errorLogPath, message, { encoding: "utf8" });
  } catch (e) {
    console.error("Failed to write to error log:", e);
  }
}
function createDemoForm(parentScreen: any) {
  var form = blessed.form({
    parent: parentScreen,
    width: "90%",
    left: "center",
    keys: true,
    vi: true,
  });
  var label1 = blessed.text({
    parent: parentScreen,
    top: 3,
    left: 5,
    content: "USERNAME:",
  });
  var username = blessed.textbox({
    parent: form,
    name: "username",
    top: 4,
    left: 5,
    height: 3,
    inputOnFocus: true,
    content: "",
    border: {
      type: "line",
    },
    focus: {
      fg: "blue",
    },
  });
  var label2 = blessed.text({
    parent: parentScreen,
    content: "PASSWORD:",
    top: 8,
    left: 5,
  });
  var password = blessed.textbox({
    parent: form,
    name: "password",
    top: 9,
    left: 5,
    height: 3,
    inputOnFocus: true,
    censor: true,
    content: "",
    border: {
      type: "line",
    },
    focus: {
      fg: "blue",
    },
  });
  // Submit/Cancel buttons
  var submit = blessed.button({
    parent: form,
    name: "submit",
    content: "Submit",
    top: 14,
    left: 5,
    shrink: true,
    padding: {
      top: 1,
      right: 2,
      bottom: 1,
      left: 2,
    },
    style: {
      bold: true,
      fg: "white",
      bg: "green",
      focus: {
        inverse: true,
      },
    },
  });
  var reset = blessed.button({
    parent: form,
    name: "reset",
    content: "Reset",
    top: 14,
    left: 15,
    shrink: true,
    padding: {
      top: 1,
      right: 2,
      bottom: 1,
      left: 2,
    },
    style: {
      bold: true,
      fg: "white",
      bg: "red",
      focus: {
        inverse: true,
      },
    },
  });
  // Info
  var msg = blessed.message({
    parent: parentScreen,
    top: 18,
    left: 5,
    style: {
      italic: true,
      fg: "green",
    },
  });
  // Event management
  submit.on("press", function () {
    form.submit();
  });
  reset.on("press", function () {
    form.reset();
  });
  form.on("submit", function (data) {
    msg.display(
      `Submitted: ${data.username || ""} / ${data.password ? "******" : ""}`,
      function () {}
    );
    fs.writeFile(
      "form-data.txt",
      `${data.username || ""} ${data.password || ""}\n`,
      function (err) {
        if (err) throw err;
      }
    );
  });
  form.on("reset", function () {
    msg.display("Form cleared!", function () {});
  });
  return form;
}

(async () => {
  // Add these lines to define screen and grid before using them
  var screen = blessed.screen({
    smartCSR: true,
    title: MCPConfig.mcp_display_name,
    dockBorders: true,
    fullUnicode: true,
    autoPadding: true,
    sendFocus: true,
    ignoreLocked: ["C-c"],
    keys: true,
    mouse: true,
    vi: true,
  });
  screen.alwaysScroll = false;
  screen.scrollable = false;
  screen.fixed = true;
  var grid = new Grid({ rows: 120, cols: 120, screen: screen });

  // Move updateBoxContents BELOW all UI variable declarations so it can access them
  const uptimeBox = Views.createUptimeBox(grid, screen);
  const dbStatusBox = Views.createDbStatusBox(grid, screen);
  const apiStatusBox = Views.createApiStatusBox(grid, screen);
  const clientStatusBox = Views.createClientStatusBox(grid);
  const connectionsBox = Views.createConnectionsBox(grid);
  const logsBox = Views.createLogsBox(grid, screen);
  const alertsBox = Views.createAlertsBox(grid, screen);
  const tempBox = Views.createTempBox(grid, screen);
  const infoBox = Views.createInfoBox(grid, screen);
  const markdownBox = Views.createMarkdownBox(grid, screen);
  const loginBox = Views.createLoginBox(grid, screen);
  const centerBox1 = Views.createCenterBox1(grid, screen);
  const centerBox2 = Views.createCenterBox2(grid, screen);
  const centerBox3 = Views.createCenterBox3(grid, screen);
  const warningsBox = Views.createWarningsBox(grid, screen);
  const criticalBox = Views.createCriticalBox(grid, screen);
  const markdownPath = path.join(__dirname, "conf", "dashboard.md");
  let markdownContent = "";
  try {
    markdownContent = fs.readFileSync(markdownPath, "utf8");
  } catch (e) {
    markdownContent = `# Welcome to MCP\n\n- Markdown file not found!${
      e?.message || "no error message"
    }`;
  }
  markdownBox.setOptions({
    firstHeading: chalk.magentaBright.italic,
    strong: chalk.magenta.bold,
    em: chalk.cyan.italic,
    code: chalk.greenBright,
  });
  markdownBox.setContent(markdownContent);
  const loginForm = createDemoForm(loginBox);
  let centerBoxes = [
    { box: centerBox1, label: "{cyan-fg} Center 1 {/cyan-fg}" },
    { box: centerBox2, label: "{magenta-fg} Center 2 {/magenta-fg}" },
    { box: centerBox3, label: "{yellow-fg} Center 3 {/yellow-fg}" },
  ];
  let centerFocusIdx = 0;

  centerBoxes.forEach((entry, idx) => {
    entry.box.on("click", () => {
      centerFocusIdx = idx;
      // Update labels and focus
      centerBoxes.forEach((entry, i) => {
        entry.box.setLabel(
          i === centerFocusIdx ? entry.label : ` Center ${i + 1} `
        );
      });
      centerBoxes[centerFocusIdx].box.focus();
      // Show/hide boxes based on focus
      logsBox.hide();
      alertsBox.hide();
      tempBox.hide();
      if (centerFocusIdx === 0) logsBox.show();
      if (centerFocusIdx === 1) alertsBox.show();
      if (centerFocusIdx === 2) tempBox.show();
    });
  });

  // Initial focus/visibility setup
  centerBoxes.forEach((entry, i) => {
    entry.box.setLabel(
      i === centerFocusIdx ? entry.label : ` Center ${i + 1} `
    );
  });
  centerBoxes[centerFocusIdx].box.focus();
  logsBox.hide();
  alertsBox.hide();
  tempBox.hide();
  if (centerFocusIdx === 0) logsBox.show();
  if (centerFocusIdx === 1) alertsBox.show();
  if (centerFocusIdx === 2) tempBox.show();

  function updateBoxContents(state: any) {
    try {
      const heapUsed = state.heapUsed || "0MB";
      const heapTotal = state.heapTotal || "0MB";
      const rss = state.rss || "0MB";
      const uptimeDisplay = state.uptime || "";
      const statusText = state.isRunning
        ? chalk.green("ONLINE")
        : chalk.red("OFFLINE");
      uptimeBox.setLabel(` Server Status [${statusText}] `);
      uptimeBox.setContent(
        chalk.green("Uptime:") +
          " " +
          chalk.white(uptimeDisplay) +
          "\n" +
          chalk.cyan("Heap:") +
          "   " +
          chalk.white(`${heapUsed} / ${heapTotal}`) +
          "\n" +
          chalk.magenta("RSS:") +
          "    " +
          chalk.white(rss)
      );
      infoBox.setContent("");
      function onlineText(val) {
        return val ? chalk.green("ONLINE") : chalk.red("OFFLINE");
      }
      function stripIsOnline(key: string) {
        // Remove 'is' prefix and 'Online' suffix if present
        let name = key;
        if (name.startsWith("is")) name = name.slice(2);
        if (name.endsWith("Online")) name = name.slice(0, -6);
        return name;
      }
      const dbStatusLines = Object.keys(serverStateConfig.dbStatus).map(
        (key) => `${stripIsOnline(key)}    ${onlineText(state[key])}`
      );
      dbStatusBox.setContent(dbStatusLines.join("\n"));
      const apiStatusLines = Object.keys(serverStateConfig.apiStatus).map(
        (key) => `${stripIsOnline(key)}    ${onlineText(state[key])}`
      );
      apiStatusBox.setContent(apiStatusLines.join("\n"));
      const clientStatusLines = Object.keys(serverStateConfig.clientStatus).map(
        (key) => `${stripIsOnline(key)}    ${onlineText(state[key])}`
      );
      clientStatusBox.setContent(clientStatusLines.join("\n"));
      const reqsPerSec = state.reqsPerSec ? state.reqsPerSec : 0;
      const sockets = state.sockets ? state.sockets : 0;
      const connectionsLines = Object.keys(
        serverStateConfig.connectionsStatus
      ).map((key) => {
        if (key === "reqsPerSec") return `Requests : ${reqsPerSec}/s`;
        if (key === "sockets") return `Sockets : ${sockets}`;
        return `${key}    ${onlineText(state[key])}`;
      });
      connectionsBox.setContent(connectionsLines.join("\n"));
    } catch (e) {
      logsBox.log(
        "[ERROR] Failed to update box contents: " + (e?.message || e)
      );
    }
  }

  updateBoxContents({});
  screen.key(["escape", "q", "C-c"], function () {
    this.destroy();
    process.exit(0);
  });
  screen.render();
})().catch((e) => {
  try {
    if (typeof logsBox !== "undefined" && logsBox?.log) {
      logsBox.log("[FATAL ERROR] " + (e?.message || e));
    }
  } catch {}
  console.error("[FATAL ERROR]", e);
  logErrorToFile(e);
});

// setupDashboardSocket({
//   logsBox,
//   warningsBox,
//   criticalBox,
//   alertsBox,
//   screen,
//   updateBoxContents,
//   idInput: () => globalThis.idInput,
//   passInput: () => globalThis.passInput,
//   serverStateConfig,
// }).catch((e) => {
//
