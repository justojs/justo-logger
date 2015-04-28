//imports
const ConsoleWriter = require("vit-logger").writer.ConsoleWriter;
const colors = require("colors");

/**
 * A colored console writer.
 *
 * @readonly theme:object              The theme to use.
 * @readonly(private) painter:Painter  The text painter.
 */
export class ColoredConsoleWriter extends ConsoleWriter {
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
   * @param theme:object    The color theme.
   *
   * @overload
   * @param pattern:string  The format pattern.
   * @param theme:object    The color theme.
   *
   * @overload
   * @protected
   * @param pattern:string  The format pattern.
   * @param theme:object    The color theme.
   * @param console:object  The console object.
   */
  constructor(...args) {
    var pattern, theme, console;

    //(1) pre: arguments
    if (args.length == 1) {
      if (typeof(args[0]) == "string") pattern = args[0];
      else theme = args[0];
    } else if (args.length == 2) {
      [pattern, theme] = args;
    } else if (args.length > 2) {
      [pattern, theme, console] = args;
    }

    theme = ColoredConsoleWriter.thematize(theme);

    //(2) superconstructor
    super(pattern, console);

    //(3) init
    Object.defineProperty(this, "theme", {value: theme, enumerable: true});
    Object.defineProperty(this, "painter", {value: new Painter(theme)});
  }

  /**
   * Creates the theme object to save.
   *
   * @private
   *
   * @param theme:object  The user theme.
   * @return object
   */
  static thematize(theme) {
    const DEFAULT_THEME = ColoredConsoleWriter.DEFAULT_THEME;
    var res;

    //(1) theme
    if (!theme || theme == {}) {
      res = DEFAULT_THEME;
    } else {
      res = {};
      res.debug = theme.debug || DEFAULT_THEME.debug;
      res.info = theme.info || DEFAULT_THEME.info;
      res.warn = theme.warn || DEFAULT_THEME.warn;
      res.error = theme.error || DEFAULT_THEME.error;
      res.fatal = theme.fatal || DEFAULT_THEME.fatal;
    }

    //(2) return
    return res;
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

Object.defineProperty(ColoredConsoleWriter, "DEFAULT_THEME", {
  value: {
    debug: "gray",
    info: "white",
    warn: "yellow",
    error: "red",
    fatal: "red"
  }
});

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
