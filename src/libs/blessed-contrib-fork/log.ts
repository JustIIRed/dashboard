import blessed, { Widgets } from "blessed";
export interface LogBoxOptions extends Widgets.BoxOptions {
  bufferLength?: number;
}
export interface LogBox extends Widgets.BoxElement {
  logLines: string[];
  log: (str: string) => void;
  type: string;
  options: LogBoxOptions;
}
export default function Log(options?: LogBoxOptions): LogBox {
  options = options || {};
  options.bufferLength = options.bufferLength || 30;
  // Use blessed.box for better scroll/focus/mouse/keyboard support
  const box = blessed.box({
    scrollable: true,
    alwaysScroll: true,
    keys: true,
    vi: true,
    mouse: true,
    scrollbar: { ch: " ", inverse: true },
    ...options,
    content: "",
  });
  box.logLines = [];
  box.log = function (str) {
    box.logLines.push(str);
    if (box.logLines.length > (box.options.bufferLength || 30)) {
      box.logLines.shift();
    }
    box.setContent(box.logLines.join("\n"));
    // Scroll to bottom
    box.scrollTo(box.getScrollHeight());
    box.screen && box.screen.render();
  };
  box.type = "log";
  return box;
}
//# sourceMappingURL=log.js.map
