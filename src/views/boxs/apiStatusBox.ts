import blessed from "neo-blessed";

export function createApiStatusBox(grid, screen) {
  return grid.set(0, 50, 20, 20, blessed.box, {
    label: " API Status ",
    border: { type: "line" },
    style: { border: { fg: "magenta" }, fg: "white", bg: "transparent" },
    tags: false,
    align: "left",
    content: "",
    scrollable: false,
    wrap: true,
    screen: screen,
  });
}
