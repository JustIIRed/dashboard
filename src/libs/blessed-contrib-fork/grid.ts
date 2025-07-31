import * as utils from "./utils.js";

const widgetSpacing = 0;

export interface GridOptions {
  screen: any;
  rows: number;
  cols: number;
  dashboardMargin?: number;
  hideBorder?: boolean;
  color?: string;
}

export default class Grid {
  options: GridOptions;
  cellWidth: number;
  cellHeight: number;

  constructor(options: GridOptions) {
    if (!options.screen)
      throw (
        "Error: A screen property must be specified in the grid options.\r\n" +
        "Note: Release 2.0.0 has breaking changes. Please refer to the README or to https://github.com/yaronn/blessed-contrib/issues/39"
      );
    this.options = options;
    this.options.dashboardMargin = this.options.dashboardMargin || 0;
    this.cellWidth =
      (100 - this.options.dashboardMargin * 2) / this.options.cols;
    this.cellHeight =
      (100 - this.options.dashboardMargin * 2) / this.options.rows;
  }

  set(
    row: number,
    col: number,
    rowSpan: number,
    colSpan: number,
    obj: (opts: any) => any,
    opts: any
  ): any {
    if (obj instanceof Grid) {
      throw (
        "Error: A Grid is not allowed to be nested inside another grid.\r\n" +
        "Note: Release 2.0.0 has breaking changes. Please refer to the README or to https://github.com/yaronn/blessed-contrib/issues/39"
      );
    }

    const top = row * this.cellHeight + this.options.dashboardMargin;
    const left = col * this.cellWidth + this.options.dashboardMargin;

    let options = {};
    options = utils.MergeRecursive(options, opts);
    (options as any).top = top + "%";
    (options as any).left = left + "%";
    (options as any).width = this.cellWidth * colSpan - widgetSpacing + "%";
    (options as any).height = this.cellHeight * rowSpan - widgetSpacing + "%";
    if (!this.options.hideBorder)
      (options as any).border = {
        type: "line",
        fg: this.options.color || "cyan",
      };

    const instance = obj(options);
    this.options.screen.append(instance);
    return instance;
  }
}
