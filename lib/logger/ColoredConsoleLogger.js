//imports
import colors from "colors";
import ConsoleLogger from "./ConsoleLogger";
import {format} from "./util";

const DEFAULT_THEME = {
  debug: "gray",
  info: "white",
  warn: "yellow",
  error: "red",
  fatal: "red"
};

/**
 * A colored console logger.
 */
export default class ColoredConsoleLogger extends ConsoleLogger {
  /**
   * Constructor.
   *
   * @overload
   * @noparam
   *
   * @overload
   * @param name:string
   *
   * @overload
   * @param opts:object
   */
  constructor(opts = {}) {
    //(1) arguments
    if (!opts) opts = {};

    //(2) super
    super(opts);

    //(3) this
    if (!opts) opts = {};
    Object.defineProperty(this, "theme", {value: Object.assign({}, DEFAULT_THEME, opts.theme), enumerable: true});
  }

  /**
   * @override
   */
  format(entry) {
    return format(entry, this.patterns, (entry) => {
      return colors[this.theme[entry.level.name.toLowerCase()]](entry.level.name);
    });
  }

  static get DEFAULT_THEME() {
    return DEFAULT_THEME;
  }
}
