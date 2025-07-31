import blessed from "neo-blessed";

export function createLoginBox(grid, screen) {
  return grid.set(20, 0, 62, 90, blessed.box, {
    label: " Login ",
    border: { type: "line" },
    style: { border: { fg: "white" }, fg: "white", bg: "transparent" },
    align: "center",
    content: "",
    scrollable: false,
    wrap: true,
    hidden: false,
    screen: screen,
  });
}
