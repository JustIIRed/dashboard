import blessed from "neo-blessed";

export function createClientStatusBox(grid, screen) {
  return grid.set(0, 70, 20, 20, blessed.box, {
    label: " Client Status ",
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
