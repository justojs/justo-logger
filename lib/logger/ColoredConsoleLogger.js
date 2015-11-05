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
   * @param opts:object
   *
   * @overload
   * @param name:string
   * @param [opts]:object
   */
  constructor(...args) {
    var opts = {};

    //(1) arguments
    if (args.length == 1) {
      if (typeof(args[0]) != "string") opts = args[0];
    } else if (args.length >= 2) {
      opts = args[1];
    }

    //(2) super
    super(...args);

    //(3) this
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
