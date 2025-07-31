import Log from "../../libs/blessed-contrib-fork/log.js";

export function createWarningsBox(grid, screen) {
  return grid.set(100, 0, 20, 60, Log, {
    label: " Warnings ",
    border: { type: "line", fg: "yellow" },
    style: { border: { fg: "yellow" }, fg: "yellow", bg: "transparent" },
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
