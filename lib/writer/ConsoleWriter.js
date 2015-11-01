//imports
import Writer from "../Writer";
import Level from "../Level";

/**
 * A console writer.
 *
 * @readonly console:any  The console object with the log/warn/error methods.
 */
export default class ConsoleWriter extends Writer {
  /**
   * Constructor.
   *
   * @overload
   * @noparam
   *
   * @overload
   * @param(attr) patterns
   *
   * @overload
   * @param pattern:string
   *
   * @overload
   * @param pattern:string
   * @param console:object
   *
   * @overload
   * @param patterns:object
   * @param console:object
   */
  constructor(...args) {
    var pats, con;

    //(1) arguments
    if (args.length == 1) {
      pats = args[0];
    } else if (args.length >= 2) {
      [pats, con] = args;
    }

    if (!con) con = console;

    //(1) super
    super(pats);

    //(3) init
    Object.defineProperty(this, "console", {value: con, enumerable: true});
  }

  /**
   * @override
   */
  write(entry) {
    var print;

    //(1) get print() function
    if (entry.level == Level.DEBUG || entry.level == Level.INFO) print = this.console.log;
    else if (entry.level == Level.WARN) print = this.console.error;
    else print = this.console.error;

    //(2) print
    print(this.format(entry));
  }
}
