import Markdown from "../../libs/blessed-contrib-fork/markdown.js";

export function createMarkdownBox(grid, screen) {
  return grid.set(60, 90, 40, 30, Markdown, {
    label: " Markdown ",
    border: { type: "line" },
    style: { border: { fg: "white" }, fg: "white", bg: "transparent" },
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
