"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LogEntry = function LogEntry(source, level, timestamp, message) {
  _classCallCheck(this, LogEntry);

  Object.defineProperty(this, "source", { value: source, enumerable: true });
  Object.defineProperty(this, "level", { value: level, enumerable: true });
  Object.defineProperty(this, "timestamp", { value: timestamp, enumerable: true });
  Object.defineProperty(this, "message", { value: message, enumerable: true });
};

exports["default"] = LogEntry;
module.exports = exports["default"];
