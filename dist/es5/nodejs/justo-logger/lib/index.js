"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var Level = require("./Level");
exports.Level = Level;
var Logger = require("./Logger");
exports.Logger = Logger;
var Writer = require("./Writer");
exports.Writer = Writer;
var writer = Object.defineProperties({}, {
  ConsoleWriter: {
    get: function get() {
      "use strict";
      return require("./writer/ConsoleWriter");
    },
    configurable: true,
    enumerable: true
  },
  ColoredConsoleWriter: {
    get: function get() {
      "use strict";
      return require("./writer/ColoredConsoleWriter");
    },
    configurable: true,
    enumerable: true
  },
  FileWriter: {
    get: function get() {
      "use strict";
      return require("./writer/FileWriter");
    },
    configurable: true,
    enumerable: true
  },
  RollingFileWriter: {
    get: function get() {
      "use strict";
      return require("./writer/RollingFileWriter");
    },
    configurable: true,
    enumerable: true
  }
});
exports.writer = writer;
