import blessed from "blessed";
import { marked } from "marked";
import TerminalRenderer from "marked-terminal";
// Do not import chalk at the top; use dynamic import for ESM compatibility
let chalk: typeof import("chalk");
export interface MarkdownOptions extends blessed.Widgets.BoxOptions {
  markdown?: string;
  markdownStyle?: Record<string, any>;
}

function Markdown(this: any, options: MarkdownOptions = {}) {
  if (!(this instanceof blessed.Box)) {
    return new (Markdown as any)(options);
  }

  const markdownOptions = {
    style: options.markdownStyle,
  };

  // Dynamically import chalk for ESM compatibility
  (async () => {
    evalStyles(markdownOptions, chalk);
    setOptions.call(this, markdownOptions.style);
  })();

  this.options = options;
  blessed.Box.call(this, options);

  if (options.markdown) setMarkdown.call(this, options.markdown);
}

function setMarkdown(this: any, str: string) {
  this.setContent(marked.parse(str));
}

function setOptions(this: any, style: Record<string, any>) {
  marked.setOptions({
    renderer: new TerminalRenderer(style),
  });
}

function evalStyles(
  options: { style?: Record<string, any> },
  chalkInstance: any
) {
  if (!options.style) return;
  for (const st in options.style) {
    if (typeof options.style[st] !== "string") continue;

    const tokens = options.style[st].split(".");
    let styleFn: any = chalkInstance;
    for (let j = 1; j < tokens.length; j++) {
      styleFn = styleFn[tokens[j]];
    }
    options.style[st] = styleFn;
  }
}

Markdown.prototype = Object.create((blessed.Box as any).prototype);

Markdown.prototype.setMarkdown = setMarkdown;
Markdown.prototype.setOptions = setOptions;
Markdown.prototype.evalStyles = evalStyles;
Markdown.prototype.getOptionsPrototype = function () {
  return {
    markdown: "string",
    markdownStyle: "object",
  };
};
Markdown.prototype.type = "markdown";

export default Markdown;
