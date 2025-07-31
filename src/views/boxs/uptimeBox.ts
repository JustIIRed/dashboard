import blessed from "neo-blessed";

export function createUptimeBox(grid, screen) {
  return grid.set(0, 0, 20, 30, blessed.box, {
    label: " Server Status ",
    border: { type: "line" },
    style: { border: { fg: "green" }, fg: "white", bg: "transparent" },
    tags: true,
    align: "left",
    content: "",
    scrollable: false,
    wrap: true,
    screen: screen,
  });
}
