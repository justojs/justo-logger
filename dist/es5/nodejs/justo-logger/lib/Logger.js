"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _Level = require("./Level");

var _Level2 = _interopRequireDefault(_Level);

var _LogEntry = require("./LogEntry");

var _LogEntry2 = _interopRequireDefault(_LogEntry);

var Logger = (function () {
  function Logger() {
    _classCallCheck(this, Logger);

    var parent, name, config, minLevel, maxLevel;

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

    minLevel = config.minLevel;
    if (typeof minLevel == "string") minLevel = _Level2["default"][minLevel.toUpperCase()];

    maxLevel = config.maxLevel;
    if (typeof maxLevel == "string") maxLevel = _Level2["default"][maxLevel.toUpperCase()];

    Object.defineProperty(this, "parent", { value: parent, enumerable: true });
    Object.defineProperty(this, "name", { value: name, enumerable: true });
    Object.defineProperty(this, "_minLevel", { value: minLevel || _Level2["default"].INFO, writable: true });
    Object.defineProperty(this, "_maxLevel", { value: maxLevel || _Level2["default"].FATAL, writable: true });
    Object.defineProperty(this, "writers", { value: [] });
  }

  _createClass(Logger, [{
    key: "write",
    value: function write(level, msg) {
      if (!level) throw new Error("Level expected.");
      if (!msg) throw new Error("Message expected.");

      if (level.value >= this.minLevel.value && level.value <= this.maxLevel.value) {
        var entry = new _LogEntry2["default"](this, level, new Date(), msg);

        for (var i = 0; i < this.writers.length; ++i) {
          var writer = this.writers[i];

          if (writer instanceof Function) writer(entry);else writer.write(entry);
        }
      }
    }
  }, {
    key: "onWrite",
    value: function onWrite(writer) {
      if (!writer) throw new Error("Listener expected.");

      this.writers.push(writer);
    }
  }, {
    key: "debug",
    value: function debug() {
      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      this.write(_Level2["default"].DEBUG, args.join(" "));
    }
  }, {
    key: "info",
    value: function info() {
      for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
      }

      this.write(_Level2["default"].INFO, args.join(" "));
    }
  }, {
    key: "warn",
    value: function warn() {
      for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        args[_key4] = arguments[_key4];
      }

      this.write(_Level2["default"].WARN, args.join(" "));
    }
  }, {
    key: "error",
    value: function error() {
      for (var _len5 = arguments.length, args = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
        args[_key5] = arguments[_key5];
      }

      this.write(_Level2["default"].ERROR, args.join(" "));
    }
  }, {
    key: "fatal",
    value: function fatal() {
      for (var _len6 = arguments.length, args = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
        args[_key6] = arguments[_key6];
      }

      this.write(_Level2["default"].FATAL, args.join(" "));
    }
  }, {
    key: "qualifiedName",
    get: function get() {
      return (this.parent ? this.parent.qualifiedName + "." : "") + this.name;
    }
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
