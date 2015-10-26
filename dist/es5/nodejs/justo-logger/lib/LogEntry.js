/**
 * A log entry.
 *
 * @readonly source:Logger  The logger source.
 * @readonly level:Level    The log level.
 * @readonly timestamp:date  The timestamp.
 * @readonly message:string  The message.
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LogEntry =
/**
 * Constructor.
 *
 * @param(attr) source
 * @param(attr) level
 * @param(attr) timestamp
 * @param(attr) message
 */
function LogEntry(source, level, timestamp, message) {
  _classCallCheck(this, LogEntry);

  Object.defineProperty(this, "source", { value: source, enumerable: true });
  Object.defineProperty(this, "level", { value: level, enumerable: true });
  Object.defineProperty(this, "timestamp", { value: timestamp, enumerable: true });
  Object.defineProperty(this, "message", { value: message, enumerable: true });
};

exports["default"] = LogEntry;
module.exports = exports["default"];
