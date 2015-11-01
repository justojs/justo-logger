//imports
import Level from "./Level";
import LogEntry from "./LogEntry";

/**
 * A logger.
 *
 * @readonly parent:Logger  The parent logger.
 * @readonly name:string    The logger name.
 * @attr minLevel:Level     The minimum level to write.
 * @attr maxLevel:Level     The maximum level to write.
 */
export default class Logger {
  /**
   * Constructor.
   *
   * @overload
   * @param(attr) name
   * @param [config]:object  The logger options: minLevel and maxLevel.
   *
   * @overload
   * @param(attr) parent
   * @param(attr) name
   * @param [config]:object  The logger options: minLevel and maxLevel.
   */
  constructor(...args) {
    var parent, name, config, minLevel, maxLevel;

    //(1) pre: arguments
    if (args.length == 1 && typeof(args[0]) == "string") {
      name = args[0];
    } else if (args.length == 2) {
      if (typeof(args[0]) == "string") [name, config] = args;
      else [parent, name] = args;
    } else if (args.length > 2) {
      [parent, name, config] = args;
    }

    if (!name) throw new Error("The logger must have a name.");
    if (!config) config = {};

    //(2) get minLevel and maxLevel
    minLevel = config.minLevel;
    if (typeof(minLevel) == "string") minLevel = Level[minLevel.toUpperCase()];

    maxLevel = config.maxLevel;
    if (typeof(maxLevel) == "string") maxLevel = Level[maxLevel.toUpperCase()];

    //(3) init
    Object.defineProperty(this, "parent", {value: parent, enumerable: true});
    Object.defineProperty(this, "name", {value: name, enumerable: true});
    Object.defineProperty(this, "_minLevel", {value: minLevel || Level.INFO, writable: true});
    Object.defineProperty(this, "_maxLevel", {value: maxLevel || Level.FATAL, writable: true});
    Object.defineProperty(this, "writers", {value: []});
  }

  /**
   * The qualified name.
   *
   * @type string
   */
  get qualifiedName() {
    return (this.parent ? this.parent.qualifiedName + ".": "") + this.name;
  }

  /**
   * @alias qualifiedName
   */
  get qn() {
    return this.qualifiedName;
  }

  get minLevel() {
    return this._minLevel;
  }

  set minLevel(level) {
    if (typeof(level) == "string") level = Level[level.toUpperCase()];
    this._minLevel = level;
  }

  get maxLevel() {
    return this._maxLevel;
  }

  set maxLevel(level) {
    if (typeof(level) == "string") level = Level[level.toUpperCase()];
    this._maxLevel = level;
  }

  /**
   * Writes a log entry.
   *
   * @protected
   */
  write(level, msg) {
    //(1) pre: arguments
    if (!level) throw new Error("Level expected.");
    if (!msg) throw new Error("Message expected.");

    //(2) emit message if needed
    if (level.value >= this.minLevel.value && level.value <= this.maxLevel.value) {
      let entry = new LogEntry(this, level, new Date(), msg);

      for (let i = 0; i < this.writers.length; ++i) {
        let writer = this.writers[i];

        if (writer instanceof Function) writer(entry);
        else writer.write(entry);
      }
    }
  }

  /**
   * Adds a writer to listen the write event.
   *
   * @param writer:Writer  The writer/listener.
   */
  onWrite(writer) {
    if (!writer) throw new Error("Listener expected.");

    this.writers.push(writer);
  }

  /**
   * Logs a DEBUG message.
   *
   * @overload
   * @param msgs:...string  The message.
   */
  debug(...args) {
    this.write(Level.DEBUG, args.join(" "));
  }

  /**
   * Logs an INFO message.
   *
   * @overload
   * @param msgs:...string  The message.
   */
  info(...args) {
    this.write(Level.INFO, args.join(" "));
  }

  /**
   * Logs a WARN message.
   *
   * @overload
   * @param msgs:...string  The message.
   */
  warn(...args) {
    this.write(Level.WARN, args.join(" "));
  }

  /**
   * Logs an ERROR message.
   *
   * @overload
   * @param msgs:...string  The message.
   */
  error(...args) {
    this.write(Level.ERROR, args.join(" "));
  }

  /**
   * Logs a FATAL message.
   *
   * @overload
   * @param msgs:...string  The message.
   */
  fatal(...args) {
    this.write(Level.FATAL, args.join(" "));
  }
}
