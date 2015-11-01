"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _ConsoleWriter2 = require("./ConsoleWriter");

var _ConsoleWriter3 = _interopRequireDefault(_ConsoleWriter2);

var _colors = require("colors");

var _colors2 = _interopRequireDefault(_colors);

var DEFAULT_THEME = {
  debug: "gray",
  info: "white",
  warn: "yellow",
  error: "red",
  fatal: "red"
};

var ColoredConsoleWriter = (function (_ConsoleWriter) {
  _inherits(ColoredConsoleWriter, _ConsoleWriter);

  function ColoredConsoleWriter() {
    _classCallCheck(this, ColoredConsoleWriter);

    var pattern, theme, console;

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    if (args.length == 1) {
      pattern = args[0];
    } else if (args.length == 2) {
      pattern = args[0];
      theme = args[1];
    } else if (args.length >= 3) {
      pattern = args[0];
      theme = args[1];
      console = args[2];
    }

    theme = Object.assign(DEFAULT_THEME, theme);

    _get(Object.getPrototypeOf(ColoredConsoleWriter.prototype), "constructor", this).call(this, pattern, console);

    Object.defineProperty(this, "theme", { value: theme, enumerable: true });
    Object.defineProperty(this, "painter", { value: new Painter(theme) });
  }

  _createClass(ColoredConsoleWriter, [{
    key: "formatLevel",
    value: function formatLevel(entry) {
      return this.painter.paint(entry);
    }
  }, {
    key: "write",
    value: function write(entry) {
      this.console.log(this.format(entry));
    }
  }]);

  return ColoredConsoleWriter;
})(_ConsoleWriter3["default"]);

exports["default"] = ColoredConsoleWriter;

Object.defineProperty(ColoredConsoleWriter, "DEFAULT_THEME", { value: DEFAULT_THEME });

var Painter = (function () {
  function Painter(config) {
    _classCallCheck(this, Painter);

    Object.defineProperty(this, "DEBUG", { value: _colors2["default"][config.debug], enumerable: true });
    Object.defineProperty(this, "INFO", { value: _colors2["default"][config.info], enumerable: true });
    Object.defineProperty(this, "WARN", { value: _colors2["default"][config.warn], enumerable: true });
    Object.defineProperty(this, "ERROR", { value: _colors2["default"][config.error], enumerable: true });
    Object.defineProperty(this, "FATAL", { value: _colors2["default"][config.fatal], enumerable: true });
  }

  _createClass(Painter, [{
    key: "paint",
    value: function paint(entry) {
      return this[entry.level.name](entry.level.name);
    }
  }]);

  return Painter;
})();

module.exports = exports["default"];
