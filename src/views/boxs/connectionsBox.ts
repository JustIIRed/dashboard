import blessed from "neo-blessed";

export function createConnectionsBox(grid, screen) {
  return grid.set(0, 90, 20, 30, blessed.box, {
    label: " Connections ",
    border: { type: "line" },
    style: { border: { fg: "green" }, fg: "white", bg: "transparent" },
    tags: false,
    align: "left",
    content: "",
    scrollable: false,
    wrap: true,
    screen: screen,
  });
}
