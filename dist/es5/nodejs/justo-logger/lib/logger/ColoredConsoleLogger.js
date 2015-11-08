"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _colors = require("colors");

var _colors2 = _interopRequireDefault(_colors);

var _ConsoleLogger2 = require("./ConsoleLogger");

var _ConsoleLogger3 = _interopRequireDefault(_ConsoleLogger2);

var _util = require("./util");

var DEFAULT_THEME = {
  debug: "gray",
  info: "white",
  warn: "yellow",
  error: "red",
  fatal: "red"
};

var ColoredConsoleLogger = (function (_ConsoleLogger) {
  _inherits(ColoredConsoleLogger, _ConsoleLogger);

  function ColoredConsoleLogger() {
    var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, ColoredConsoleLogger);

    if (!opts) opts = {};

    _get(Object.getPrototypeOf(ColoredConsoleLogger.prototype), "constructor", this).call(this, opts);

    if (!opts) opts = {};
    Object.defineProperty(this, "theme", { value: Object.assign({}, DEFAULT_THEME, opts.theme), enumerable: true });
  }

  _createClass(ColoredConsoleLogger, [{
    key: "format",
    value: function format(entry) {
      var _this = this;

      return (0, _util.format)(entry, this.patterns, function (entry) {
        return _colors2["default"][_this.theme[entry.level.name.toLowerCase()]](entry.level.name);
      });
    }
  }], [{
    key: "DEFAULT_THEME",
    get: function get() {
      return DEFAULT_THEME;
    }
  }]);

  return ColoredConsoleLogger;
})(_ConsoleLogger3["default"]);

exports["default"] = ColoredConsoleLogger;
module.exports = exports["default"];
