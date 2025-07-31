import Log from "../../libs/blessed-contrib-fork/log.js";

export function createLogsBox(grid, screen) {
  return grid.set(20, 0, 62, 90, Log, {
    bufferLength: 500,
    label: " Logs ",
    border: { type: "line", fg: "cyan" },
    tags: true,
    scrollable: true,
    alwaysScroll: true,
    mouse: true,
    keys: true,
    vi: true,
    scrollbar: { ch: " ", inverse: true },
    padding: { left: 1, right: 1 },
    screen: screen,
  });
}
