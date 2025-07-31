import blessed from "neo-blessed";

export function createCenterBox2(grid, screen) {
  return grid.set(82, 30, 18, 30, blessed.box, {
    label: " Center 2 ",
    border: { type: "line" },
    style: { border: { fg: "magenta" }, fg: "white", bg: "transparent" },
    align: "center",
    tags: true,
    content: "",
    scrollable: false,
    wrap: true,
    input: true,
    keys: true,
    vi: true,
    screen: screen,
  });
}
