/**
 * A log entry.
 *
 * @readonly source:Logger  The logger source.
 * @readonly level:Level    The log level.
 * @readonly timestamp:date  The timestamp.
 * @readonly message:string  The message.
 */
export class LogEntry {
  /**
   * Constructor.
   *
   * @param(attr) source
   * @param(attr) level
   * @param(attr) timestamp
   * @param(attr) message
   */
  constructor(source, level, timestamp, message) {
    Object.defineProperty(this, "source", {value: source, enumerable: true});
    Object.defineProperty(this, "level", {value: level, enumerable: true});
    Object.defineProperty(this, "timestamp", {value: timestamp, enumerable: true});
    Object.defineProperty(this, "message", {value: message, enumerable: true});
  }
}
