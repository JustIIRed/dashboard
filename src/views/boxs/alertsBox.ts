import Log from "../../libs/blessed-contrib-fork/log.js";

export function createAlertsBox(grid, screen) {
  return grid.set(20, 0, 62, 90, Log, {
    label: " Alerts ",
    border: { type: "line" },
    style: { border: { fg: "magenta" }, fg: "white", bg: "transparent" },
    tags: true,
    scrollable: true,
    alwaysScroll: true,
    mouse: true,
    keys: true,
    vi: true,
    scrollbar: { ch: " ", inverse: true },
    padding: { left: 1, right: 1 },
    screen: screen,
    hidden: true,
  });
}
