//imports
import ConsoleWriter from "./ConsoleWriter";
import colors  from "colors";

const DEFAULT_THEME = {
  debug: "gray",
  info: "white",
  warn: "yellow",
  error: "red",
  fatal: "red"
};

/**
 * A colored console writer.
 *
 * @readonly theme:object              The theme to use.
 * @readonly(private) painter:Painter  The text painter.
 */
export default class ColoredConsoleWriter extends ConsoleWriter {
  /**
   * Constructor.
   *
   * @overload
   * @noparam
   *
   * @overload
   * @param pattern:string  The format pattern.
   *
   * @overload
   * @param patterns:object
   *
   * @overload
   * @param pattern:string  The format pattern.
   * @param theme:object    The color theme.
   *
   * @overload
   * @param patterns:object
   * @param theme:object
   *
   * @overload
   * @param pattern:string  The format pattern.
   * @param theme:object    The color theme.
   * @param console:object  The console object.
   */
  constructor(...args) {
    var pattern, theme, console;

    //(1) pre: arguments
    if (args.length == 1) {
      pattern = args[0];
    } else if (args.length == 2) {
      [pattern, theme] = args;
    } else if (args.length >= 3) {
      [pattern, theme, console] = args;
    }

    theme = Object.assign(DEFAULT_THEME, theme);

    //(2) superconstructor
    super(pattern, console);

    //(3) init
    Object.defineProperty(this, "theme", {value: theme, enumerable: true});
    Object.defineProperty(this, "painter", {value: new Painter(theme)});
  }

  /**
   * @override
   */
  formatLevel(entry) {
    return this.painter.paint(entry);
  }

  /**
   * @override
   */
  write(entry) {
    this.console.log(this.format(entry));
  }
}

Object.defineProperty(ColoredConsoleWriter, "DEFAULT_THEME", {value: DEFAULT_THEME});

/**
 * The painter.
 *
 * @internal
 *
 * @readonly(internal) debug:function
 * @readonly(internal) info:function
 * @readonly(internal) warn:function
 * @readonly(internal) error:function
 * @readonly(internal) fatal:function
 */
class Painter {
  /**
   * Constructor.
   *
   * @param config:object  The colors.
   */
  constructor(config) {
    Object.defineProperty(this, "DEBUG", {value: colors[config.debug], enumerable: true});
    Object.defineProperty(this, "INFO", {value: colors[config.info], enumerable: true});
    Object.defineProperty(this, "WARN", {value: colors[config.warn], enumerable: true});
    Object.defineProperty(this, "ERROR", {value: colors[config.error], enumerable: true});
    Object.defineProperty(this, "FATAL", {value: colors[config.fatal], enumerable: true});
  }

  /**
   * Paints the entry.
   */
  paint(entry) {
    return this[entry.level.name](entry.level.name);
  }
}
