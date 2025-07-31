import blessed from "neo-blessed";

export function createInfoBox(grid, screen) {
  return grid.set(20, 90, 40, 30, blessed.box, {
    label: " Info ",
    border: { type: "line" },
    style: { border: { fg: "blue" }, fg: "blue", bg: "transparent" },
    align: "left",
    content: "",
    scrollable: true,
    alwaysScroll: true,
    wrap: true,
    mouse: true,
    keys: true,
    vi: true,
    scrollbar: { ch: " ", inverse: true },
    padding: { left: 1, right: 1 },
    screen: screen,
  });
}
