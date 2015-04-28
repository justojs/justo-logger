"use strict";

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * The log level.
 *
 * @enum
 */

var Level = exports.Level =
/**
 * Constructor.
 *
 * @private
 */
function Level(name, value) {
  _classCallCheck(this, Level);

  Object.defineProperty(this, "name", { value: name, enumerable: true });
  Object.defineProperty(this, "value", { value: value, enumerable: true });
};

Object.defineProperty(Level, "DEBUG", { value: new Level("DEBUG", 0), enumerable: true });
Object.defineProperty(Level, "INFO", { value: new Level("INFO", 1), enumerable: true });
Object.defineProperty(Level, "WARN", { value: new Level("WARN", 2), enumerable: true });
Object.defineProperty(Level, "ERROR", { value: new Level("ERROR", 3), enumerble: true });
Object.defineProperty(Level, "FATAL", { value: new Level("FATAL", 4), enumerable: true });

"use strict";

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * A log entry.
 *
 * @readonly source:Logger  The logger source.
 * @readonly level:Level    The log level.
 * @readonly timestamp:date  The timestamp.
 * @readonly message:string  The message.
 */

var LogEntry = exports.LogEntry =
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

"use strict";

var _slicedToArray = function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; for (var _iterator = arr[Symbol.iterator](), _step; !(_step = _iterator.next()).done;) { _arr.push(_step.value); if (i && _arr.length === i) break; } return _arr; } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } };

var _toConsumableArray = function (arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
  value: true
});
//imports
var util = require("util");

/**
 * A logger.
 *
 * @readonly parent:Logger  The parent logger.
 * @readonly name:string    The logger name.
 * @attr minLevel:Level     The minimum level to write.
 * @attr maxLevel:Level     The maximum level to write.
 */

var Logger = exports.Logger = (function () {
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

  function Logger() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _classCallCheck(this, Logger);

    var parent, name, config, minLevel, maxLevel;

    //(1) pre: arguments
    if (args.length == 1 && typeof args[0] == "string") {
      name = args[0];
    } else if (args.length == 2) {
      if (typeof args[0] == "string") {
        var _ref = args;

        var _ref2 = _slicedToArray(_ref, 2);

        name = _ref2[0];
        config = _ref2[1];
      } else {
        var _ref3 = args;

        var _ref32 = _slicedToArray(_ref3, 2);

        parent = _ref32[0];
        name = _ref32[1];
      }
    } else if (args.length > 2) {
      var _ref4 = args;

      var _ref42 = _slicedToArray(_ref4, 3);

      parent = _ref42[0];
      name = _ref42[1];
      config = _ref42[2];
    }

    if (!name) throw new Error("The logger must have a name.");
    if (!config) config = {};

    //(2) get minLevel and maxLevel
    minLevel = config.minLevel;
    if (typeof minLevel == "string") minLevel = Level[minLevel.toUpperCase()];

    maxLevel = config.maxLevel;
    if (typeof maxLevel == "string") maxLevel = Level[maxLevel.toUpperCase()];

    //(3) init
    Object.defineProperty(this, "parent", { value: parent, enumerable: true });
    Object.defineProperty(this, "name", { value: name, enumerable: true });
    Object.defineProperty(this, "_minLevel", { value: minLevel || Level.INFO, writable: true });
    Object.defineProperty(this, "_maxLevel", { value: maxLevel || Level.FATAL, writable: true });
    Object.defineProperty(this, "writers", { value: [] });
  }

  _createClass(Logger, {
    qualifiedName: {

      /**
       * The qualified name.
       *
       * @type string
       */

      get: function () {
        return (this.parent ? this.parent.qualifiedName + "." : "") + this.name;
      }
    },
    qn: {

      /**
       * @alias qualifiedName
       */

      get: function () {
        return this.qualifiedName;
      }
    },
    minLevel: {
      get: function () {
        return this._minLevel;
      },
      set: function (level) {
        if (typeof level == "string") level = Level[level.toUpperCase()];
        this._minLevel = level;
      }
    },
    maxLevel: {
      get: function () {
        return this._maxLevel;
      },
      set: function (level) {
        if (typeof level == "string") level = Level[level.toUpperCase()];
        this._maxLevel = level;
      }
    },
    write: {

      /**
       * Writes a log entry.
       *
       * @protected
       */

      value: function write(level, msg) {
        //(1) pre: arguments
        if (!level) throw new Error("Level expected.");
        if (!msg) throw new Error("Message expected.");

        //(2) emit message if needed
        if (level.value >= this.minLevel.value && level.value <= this.maxLevel.value) {
          var entry = new LogEntry(this, level, new Date(), msg);

          for (var i = 0; i < this.writers.length; ++i) {
            var writer = this.writers[i];

            if (writer instanceof Function) writer(entry);else writer.write(entry);
          }
        }
      }
    },
    onWrite: {

      /**
       * Adds a writer to listen the write event.
       *
       * @param writer:Writer  The writer/listener.
       */

      value: function onWrite(writer) {
        if (!writer) throw new Error("Listener expected.");

        this.writers.push(writer);
      }
    },
    format: {

      /**
       * Formats the message.
       *
       * @private
       *
       * @overload
       * @param msg:string      The message.
       *
       * @overload Using util.format() format.
       * @param format:string    The format pattern.
       * @param params:object[]  The parameters.
       */

      value: function format() {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        var res;

        //(1) format
        if (args.length === 0) res = "";else if (args.length == 1) res = args[0];else res = util.format.apply(util, [args[0]].concat(_toConsumableArray(args.slice(1))));

        //(2) return
        return res;
      }
    },
    debug: {

      /**
       * Logs a DEBUG message.
       *
       * @overload
       * @param msg:string      The message.
       *
       * @overload Using util.format() format.
       * @param format:string    The format pattern.
       * @param params:object[]  The parameters.
       */

      value: function debug() {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        this.write(Level.DEBUG, this.format.apply(this, args));
      }
    },
    info: {

      /**
       * Logs an INFO message.
       *
       * @overload
       * @param msg:string      The message.
       *
       * @overload Using util.format() format.
       * @param format:string    The format pattern.
       * @param params:object[]  The parameters.
       */

      value: function info() {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        this.write(Level.INFO, this.format.apply(this, args));
      }
    },
    warn: {

      /**
       * Logs a WARN message.
       *
       * @overload
       * @param msg:string      The message.
       *
       * @overload Using util.format() format.
       * @param format:string    The format pattern.
       * @param params:object[]  The parameters.
       */

      value: function warn() {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        this.write(Level.WARN, this.format.apply(this, args));
      }
    },
    error: {

      /**
       * Logs an ERROR message.
       *
       * @overload
       * @param msg:string      The message.
       *
       * @overload Using util.format() format.
       * @param format:string    The format pattern.
       * @param params:object[]  The parameters.
       */

      value: function error() {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        this.write(Level.ERROR, this.format.apply(this, args));
      }
    },
    fatal: {

      /**
       * Logs a FATAL message.
       *
       * @overload
       * @param msg:string      The message.
       *
       * @overload Using util.format() format.
       * @param format:string    The format pattern.
       * @param params:object[]  The parameters.
       */

      value: function fatal() {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        this.write(Level.FATAL, this.format.apply(this, args));
      }
    }
  });

  return Logger;
})();

"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * A writer.
 *
 * @abstract
 * @readonly pattern:string  The format pattern.
 */

var Writer = exports.Writer = (function () {
  /**
   * Constructor.
   *
   * @param(attr) pattern
   */

  function Writer() {
    var pattern = arguments[0] === undefined ? Writer.DEFAULT_PATTERN : arguments[0];

    _classCallCheck(this, Writer);

    Object.defineProperty(this, "pattern", { value: pattern, enumerable: true });
  }

  _createClass(Writer, {
    write: {

      /**
       * Writes a log entry.
       *
       * @abstract
       * @param entry:LogEntry  The log entry.
       */

      value: function write(entry) {
        throw new Error("Abstract method.");
      }
    },
    format: {

      /**
       * Builds the line to write.
       *
       * @protected
       * @param entry:LogEntry  The log entry to build.
       */

      value: function format(entry) {
        var line;

        //(1) format
        line = this.pattern;
        line = line.replace("%l", this.formatLevel(entry));
        line = line.replace("%s", entry.source.qn);
        line = line.replace("%t", this.formatTimestamp(entry));
        line = line.replace("%m", entry.message);

        //(2) return
        return line;
      }
    },
    formatLevel: {

      /**
       * Formats the level.
       *
       * @protected
       * @param entry:LogEntry  The entry.
       * @return string
       */

      value: function formatLevel(entry) {
        return entry.level.name;
      }
    },
    formatTimestamp: {

      /**
       * Formats a timestamp.
       *
       * @protected
       * @param entry:LogEntry  The entry.
       * @return string
       */

      value: function formatTimestamp(entry) {
        var ts, day, mon, year, hour, min, sec;

        ts = entry.timestamp;

        day = ts.getDate();
        mon = ts.getMonth() + 1;
        year = ts.getFullYear();
        hour = ts.getHours();
        min = ts.getMinutes();
        sec = ts.getSeconds();

        if (day < 10) day = "0" + day;
        if (mon < 10) mon = "0" + mon;
        if (hour < 10) hour = "0" + hour;
        if (min < 10) min = "0" + min;
        if (sec < 10) min = "0" + sec;

        return year + "-" + mon + "-" + day + " " + hour + ":" + min + ":" + sec;
      }
    }
  });

  return Writer;
})();

Object.defineProperty(Writer, "DEFAULT_PATTERN", { value: "%l [%t]: %m" });

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var writer = Object.defineProperties({}, {
  ConsoleWriter: {
    get: function () {
      "use strict";

      return require("./writer/ConsoleWriter").ConsoleWriter;
    },
    configurable: true,
    enumerable: true
  },
  ColoredConsoleWriter: {
    get: function () {
      "use strict";

      return require("./writer/ColoredConsoleWriter").ColoredConsoleWriter;
    },
    configurable: true,
    enumerable: true
  },
  FileWriter: {
    get: function () {
      "use strict";

      return require("./writer/FileWriter").FileWriter;
    },
    configurable: true,
    enumerable: true
  },
  RollingFileWriter: {
    get: function () {
      "use strict";

      return require("./writer/RollingFileWriter").RollingFileWriter;
    },
    configurable: true,
    enumerable: true
  }
});
exports.writer = writer;