//imports
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _Level = require("./Level");

var _Level2 = _interopRequireDefault(_Level);

var _LogEntry = require("./LogEntry");

var _LogEntry2 = _interopRequireDefault(_LogEntry);

/**
 * A logger.
 *
 * @readonly parent:Logger  The parent logger.
 * @readonly name:string    The logger name.
 * @attr minLevel:Level     The minimum level to write.
 * @attr maxLevel:Level     The maximum level to write.
 */
var util = require("util");

var Logger = (function () {
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
    _classCallCheck(this, Logger);

    var parent, name, config, minLevel, maxLevel;

    //(1) pre: arguments

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    if (args.length == 1 && typeof args[0] == "string") {
      name = args[0];
    } else if (args.length == 2) {
      if (typeof args[0] == "string") {
        ;
        name = args[0];
        config = args[1];
      } else {
        ;
        parent = args[0];
        name = args[1];
      }
    } else if (args.length > 2) {
      parent = args[0];
      name = args[1];
      config = args[2];
    }

    if (!name) throw new Error("The logger must have a name.");
    if (!config) config = {};

    //(2) get minLevel and maxLevel
    minLevel = config.minLevel;
    if (typeof minLevel == "string") minLevel = _Level2["default"][minLevel.toUpperCase()];

    maxLevel = config.maxLevel;
    if (typeof maxLevel == "string") maxLevel = _Level2["default"][maxLevel.toUpperCase()];

    //(3) init
    Object.defineProperty(this, "parent", { value: parent, enumerable: true });
    Object.defineProperty(this, "name", { value: name, enumerable: true });
    Object.defineProperty(this, "_minLevel", { value: minLevel || _Level2["default"].INFO, writable: true });
    Object.defineProperty(this, "_maxLevel", { value: maxLevel || _Level2["default"].FATAL, writable: true });
    Object.defineProperty(this, "writers", { value: [] });
  }

  /**
   * The qualified name.
   *
   * @type string
   */

  _createClass(Logger, [{
    key: "write",

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
        var entry = new _LogEntry2["default"](this, level, new Date(), msg);

        for (var i = 0; i < this.writers.length; ++i) {
          var writer = this.writers[i];

          if (writer instanceof Function) writer(entry);else writer.write(entry);
        }
      }
    }

    /**
     * Adds a writer to listen the write event.
     *
     * @param writer:Writer  The writer/listener.
     */
  }, {
    key: "onWrite",
    value: function onWrite(writer) {
      if (!writer) throw new Error("Listener expected.");

      this.writers.push(writer);
    }

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
  }, {
    key: "format",
    value: function format() {
      var res;

      //(1) format

      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      if (args.length === 0) res = "";else if (args.length == 1) res = args[0];else res = util.format.apply(util, [args[0]].concat(_toConsumableArray(args.slice(1))));

      //(2) return
      return res;
    }

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
  }, {
    key: "debug",
    value: function debug() {
      this.write(_Level2["default"].DEBUG, this.format.apply(this, arguments));
    }

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
  }, {
    key: "info",
    value: function info() {
      this.write(_Level2["default"].INFO, this.format.apply(this, arguments));
    }

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
  }, {
    key: "warn",
    value: function warn() {
      this.write(_Level2["default"].WARN, this.format.apply(this, arguments));
    }

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
  }, {
    key: "error",
    value: function error() {
      this.write(_Level2["default"].ERROR, this.format.apply(this, arguments));
    }

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
  }, {
    key: "fatal",
    value: function fatal() {
      this.write(_Level2["default"].FATAL, this.format.apply(this, arguments));
    }
  }, {
    key: "qualifiedName",
    get: function get() {
      return (this.parent ? this.parent.qualifiedName + "." : "") + this.name;
    }

    /**
     * @alias qualifiedName
     */
  }, {
    key: "qn",
    get: function get() {
      return this.qualifiedName;
    }
  }, {
    key: "minLevel",
    get: function get() {
      return this._minLevel;
    },
    set: function set(level) {
      if (typeof level == "string") level = _Level2["default"][level.toUpperCase()];
      this._minLevel = level;
    }
  }, {
    key: "maxLevel",
    get: function get() {
      return this._maxLevel;
    },
    set: function set(level) {
      if (typeof level == "string") level = _Level2["default"][level.toUpperCase()];
      this._maxLevel = level;
    }
  }]);

  return Logger;
})();

exports["default"] = Logger;
module.exports = exports["default"];
