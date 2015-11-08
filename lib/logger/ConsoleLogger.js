//imports
import Logger from "../Logger";
import Level from "../Level";
import {format} from "./util";

/**
 * A logger to write to the console.
 *
 * @readonly(-) console:object The console object.
 */
export default class ConsoleLogger extends Logger {
  /*
   * Constructor.
   *
   * @overload
   * @noparam
   *
   * @overload
   * @param(attr) name
   *
   * @overload
   * @param opts:object   The logger options.
   */
  constructor(opts = {}) {
    //(1) arguments
    if (!opts) opts = {};

    //(2) super
    super(opts);

    //(3) this
    Object.defineProperty(this, "console", {value: console, writable: true});
  }

  /**
   * @override
   */
  write(entry) {
    var print;

    //(1) get print() function
    if (entry.level == Level.DEBUG || entry.level == Level.INFO) print = this.console.log;
    else print = this.console.error;

    //(2) print
    print(this.format(entry));
  }

  /**
   * @protected
   */
  format(entry) {
    return format(entry, this.patterns);
  }
}
