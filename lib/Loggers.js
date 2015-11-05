/**
 * A collection of loggers.
 */
export default class Loggers extends Array {
  /**
   * @alias push()
   */
  add(logger) {
    this.push(logger);
  }

  /**
   * Invokes Logger.debug() with the message.
   */
  debug(...msg) {
    for (let logger of this) {
      logger.debug(...msg);
    }
  }

  /**
   * Invokes Logger.info() with the message.
   */
  info(...msg) {
    for (let logger of this) {
      logger.info(...msg);
    }
  }

  /**
   * Invokes Logger.warn() with the message.
   */
  warn(...msg) {
    for (let logger of this) {
      logger.warn(...msg);
    }
  }

  /**
   * Invokes Logger.error() with the message.
   */
  error(...msg) {
    for (let logger of this) {
      logger.error(...msg);
    }
  }

  /**
   * Invokes Logger.fatal() with the message.
   */
  fatal(...msg) {
    for (let logger of this) {
      logger.fatal(...msg);
    }
  }
}
