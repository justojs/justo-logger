"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _Logger2 = require("../Logger");

var _Logger3 = _interopRequireDefault(_Logger2);

var _Level = require("../Level");

var _Level2 = _interopRequireDefault(_Level);

var _util = require("./util");

var ConsoleLogger = (function (_Logger) {
  _inherits(ConsoleLogger, _Logger);

  function ConsoleLogger() {
    _classCallCheck(this, ConsoleLogger);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _get(Object.getPrototypeOf(ConsoleLogger.prototype), "constructor", this).apply(this, args);

    Object.defineProperty(this, "console", { value: console, writable: true });
  }

  _createClass(ConsoleLogger, [{
    key: "write",
    value: function write(entry) {
      var print;

      if (entry.level == _Level2["default"].DEBUG || entry.level == _Level2["default"].INFO) print = this.console.log;else print = this.console.error;

      print(this.format(entry));
    }
  }, {
    key: "format",
    value: function format(entry) {
      return (0, _util.format)(entry, this.patterns);
    }
  }]);

  return ConsoleLogger;
})(_Logger3["default"]);

exports["default"] = ConsoleLogger;
module.exports = exports["default"];
