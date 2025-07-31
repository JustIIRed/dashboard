import blessed from "neo-blessed";

export function createCenterBox1(grid, screen) {
  return grid.set(82, 0, 18, 30, blessed.box, {
    label: "{cyan-fg} Center 1 {/cyan-fg}",
    border: { type: "line" },
    style: { border: { fg: "cyan" }, fg: "white", bg: "transparent" },
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
