/**
 * A collection of loggers.
 */
export default class Loggers {
  /**
   * Constructor.
   */
  constructor() {
    Object.defineProperty(this, "items", {value: []});
  }

  /**
   * Number of loggers.
   *
   * @type number
   */
  get length() {
    return this.items.length;
  }

  /**
   * @alias push()
   */
  add(logger) {
    this.items.push(logger);
  }

  /**
   * Invokes Logger.debug() with the message.
   */
  debug(...msg) {
    for (let logger of this.items) {
      logger.debug(...msg);
    }
  }

  /**
   * Invokes Logger.info() with the message.
   */
  info(...msg) {
    for (let logger of this.items) {
      logger.info(...msg);
    }
  }

  /**
   * Invokes Logger.warn() with the message.
   */
  warn(...msg) {
    for (let logger of this.items) {
      logger.warn(...msg);
    }
  }

  /**
   * Invokes Logger.error() with the message.
   */
  error(...msg) {
    for (let logger of this.items) {
      logger.error(...msg);
    }
  }

  /**
   * Invokes Logger.fatal() with the message.
   */
  fatal(...msg) {
    for (let logger of this.items) {
      logger.fatal(...msg);
    }
  }
}
