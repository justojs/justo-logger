/**
 * The log level.
 *
 * @enum
 */
export class Level {
  /**
   * Constructor.
   *
   * @private
   */
  constructor(name, value) {
    Object.defineProperty(this, "name", {value: name, enumerable: true});
    Object.defineProperty(this, "value", {value: value, enumerable: true});
  }
}

Object.defineProperty(Level, "DEBUG", {value: new Level("DEBUG", 0), enumerable: true});
Object.defineProperty(Level, "INFO", {value: new Level("INFO", 1), enumerable: true});
Object.defineProperty(Level, "WARN", {value: new Level("WARN", 2), enumerable: true});
Object.defineProperty(Level, "ERROR", {value: new Level("ERROR", 3), enumerble: true});
Object.defineProperty(Level, "FATAL", {value: new Level("FATAL", 4), enumerable: true});
