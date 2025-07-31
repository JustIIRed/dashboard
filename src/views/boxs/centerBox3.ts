import blessed from "neo-blessed";

export function createCenterBox3(grid, screen) {
  return grid.set(82, 60, 18, 30, blessed.box, {
    label: " Center 3 ",
    border: { type: "line" },
    style: { border: { fg: "yellow" }, fg: "white", bg: "transparent" },
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
