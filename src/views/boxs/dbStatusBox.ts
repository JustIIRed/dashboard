import blessed from "neo-blessed";

export function createDbStatusBox(grid, screen) {
  return grid.set(0, 30, 20, 20, blessed.box, {
    label: " DB Status ",
    border: { type: "line" },
    style: { border: { fg: "yellow" }, fg: "white", bg: "transparent" },
    tags: false,
    align: "left",
    content: "",
    scrollable: false,
    wrap: true,
    screen: screen,
  });
}
