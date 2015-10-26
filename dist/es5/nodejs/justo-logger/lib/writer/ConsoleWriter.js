//imports
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _Writer2 = require("../Writer");

var _Writer3 = _interopRequireDefault(_Writer2);

var _Level = require("../Level");

var _Level2 = _interopRequireDefault(_Level);

/**
 * A console writer.
 *
 * @readonly console:any  The console object with the log/warn/error methods.
 */

var ConsoleWriter = (function (_Writer) {
  _inherits(ConsoleWriter, _Writer);

  /**
   * Constructor.
   *
   * @overload
   * @noparam
   *
   * @overload
   * @param(attr) pattern
   *
   * @overload
   * @param(attr) console
   *
   * @overload
   * @protected
   * @param(attr) pattern
   * @param(attr) console
   */

  function ConsoleWriter() {
    _classCallCheck(this, ConsoleWriter);

    var pat, con;

    //(1) pre: arguments

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    if (args.length == 1) {
      if (typeof args[0] == "string") pat = args[0];else con = args[0];
    } else if (args.length > 1) {
      pat = args[0];
      con = args[1];
    }

    if (!con) con = console;

    //(2) superconstructor
    _get(Object.getPrototypeOf(ConsoleWriter.prototype), "constructor", this).call(this, pat);

    //(3) init
    Object.defineProperty(this, "console", { value: con, enumerable: true });
  }

  /**
   * @override
   */

  _createClass(ConsoleWriter, [{
    key: "write",
    value: function write(entry) {
      var print;

      //(1) get print() function
      if (entry.level == _Level2["default"].DEBUG || entry.level == _Level2["default"].INFO) print = this.console.log;else if (entry.level == _Level2["default"].WARN) print = this.console.error;else print = this.console.error;

      //(2) print
      print(this.format(entry));
    }
  }]);

  return ConsoleWriter;
})(_Writer3["default"]);

exports["default"] = ConsoleWriter;
module.exports = exports["default"];
