//imports
import Level from "./Level";
import LogEntry from "./LogEntry";

const DEFAULT_OPTIONS = {
  enabled: true,
  minLevel: Level.INFO,
  maxLevel: Level.FATAL,
  pattern: "%l [%t]: %m",
  patterns: {
    debug: "%l [%t]: %m",
    info: "%l [%t]: %m",
    warn: "%l [%t]: %m",
    error: "%l [%t]: %m",
    fatal: "%l [%t]: %m"
  }
};

//private write method
const write = Symbol();

/**
 * A logger.
 *
 * @abstract
 *
 * @readonly name:string      The logger name.
 * @readonly minLevel:Level   The minimum level to write.
 * @readonly maxLevel:Level   The maximum level to write.
 * @readonly patterns:object  The patterns.
 * @readonly enabled:boolean  Is it enabled? true, yep; false, nope.
 */
export default class Logger {
  /**
   * Constructor.
   *
   * @overload
   * @noparam
   *
   * @overload
   * @param [opts]:object The logger options.
   *
   * @overload
   * @param(attr) name
   * @param [opts]:object The logger options.
   */
  constructor(...args) {
    var name, opts;

    //(1) pre: arguments
    if (args.length == 1) {
      if (typeof(args[0]) == "string") name = args[0];
      else opts = args[0];
    } else if (args.length >= 2) {
      [name, opts] = args;
    }

    if (!opts) {
      opts = Object.assign({}, DEFAULT_OPTIONS);
    } else {
      let aux = Object.assign({}, DEFAULT_OPTIONS, opts);

      if (opts.hasOwnProperty("pattern")) {
        let pattern = opts.pattern;

        if (opts.hasOwnProperty("patterns")) {
          if (!opts.patterns.hasOwnProperty("debug")) aux.patterns.debug = pattern;
          if (!opts.patterns.hasOwnProperty("info")) aux.patterns.info = pattern;
          if (!opts.patterns.hasOwnProperty("warn")) aux.patterns.warn = pattern;
          if (!opts.patterns.hasOwnProperty("error")) aux.patterns.error = pattern;
          if (!opts.patterns.hasOwnProperty("fatal")) aux.patterns.fatal = pattern;
        } else {
          aux.patterns.debug = pattern;
          aux.patterns.info = pattern;
          aux.patterns.warn = pattern;
          aux.patterns.error = pattern;
          aux.patterns.fatal = pattern;
        }
      }

      if (typeof(aux.minLevel) == "string") aux.minLevel = Level.parse(aux.minLevel);
      if (typeof(aux.maxLevel) == "string") aux.maxLevel = Level.parse(aux.maxLevel);

      opts = aux;
    }

    //(2) init
    Object.defineProperty(this, "name", {value: name || "logger", enumerable: true});
    Object.defineProperty(this, "enabled", {value: opts.enabled, enumerable: true});
    Object.defineProperty(this, "minLevel", {value: opts.minLevel, enumerable: true});
    Object.defineProperty(this, "maxLevel", {value: opts.maxLevel, enumerable: true});
    Object.defineProperty(this, "patterns", {value: opts.patterns, enumerable: true});
  }

  /**
   * Is it disabled?
   *
   * @type boolean
   */
  get disabled() {
    return !this.enabled;
  }

  /**
   * Writes the entry.
   *
   * @protected
   * @abstract
   *
   * @param entry:LogEntry  The entry to write.
   */
  write(entry) {
    throw new Error("Abstract method.");
  }

  /**
   * Writes the entry if needed.
   *
   * @private
   */
  [write](level, msg) {
    if (this.enabled && level.value >= this.minLevel.value && level.value <= this.maxLevel.value) {
      this.write(new LogEntry(this, level, new Date(), msg.join(" ")));
    }
  }

  /**
   * Logs a DEBUG message.
   *
   * @overload
   * @param msgs:...string  The message.
   */
  debug(...args) {
    this[write](Level.DEBUG, args);
  }

  /**
   * Logs an INFO message.
   *
   * @overload
   * @param msgs:...string  The message.
   */
  info(...args) {
    this[write](Level.INFO, args);
  }

  /**
   * Logs a WARN message.
   *
   * @overload
   * @param msgs:...string  The message.
   */
  warn(...args) {
    this[write](Level.WARN, args);
  }

  /**
   * Logs an ERROR message.
   *
   * @overload
   * @param msgs:...string  The message.
   */
  error(...args) {
    this[write](Level.ERROR, args);
  }

  /**
   * Logs a FATAL message.
   *
   * @overload
   * @param msgs:...string  The message.
   */
  fatal(...args) {
    this[write](Level.FATAL, args);
  }

  static get DEFAULT_OPTIONS() {
    return DEFAULT_OPTIONS;
  }
}
