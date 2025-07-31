import Log from "../../libs/blessed-contrib-fork/log.js";

export function createCriticalBox(grid, screen) {
  return grid.set(100, 60, 20, 60, Log, {
    label: " Critical ",
    border: { type: "line", fg: "red" },
    style: { border: { fg: "red" }, fg: "red", bg: "transparent" },
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
