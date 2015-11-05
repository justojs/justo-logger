"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var Level = require("./Level");
exports.Level = Level;
var LogEntry = require("./LogEntry");
exports.LogEntry = LogEntry;
var Loggers = require("./Loggers");
exports.Loggers = Loggers;
var Logger = require("./Logger");
exports.Logger = Logger;
var logger = Object.defineProperties({}, {
  ConsoleLogger: {
    get: function get() {
      "use strict";
      return require("./logger/ConsoleLogger");
    },
    configurable: true,
    enumerable: true
  },
  ColoredConsoleLogger: {
    get: function get() {
      "use strict";
      return require("./logger/ColoredConsoleLogger");
    },
    configurable: true,
    enumerable: true
  },
  FileLogger: {
    get: function get() {
      "use strict";
      return require("./logger/FileLogger");
    },
    configurable: true,
    enumerable: true
  },
  RollingFileLogger: {
    get: function get() {
      "use strict";
      return require("./logger/RollingFileLogger");
    },
    configurable: true,
    enumerable: true
  }
});
exports.logger = logger;
