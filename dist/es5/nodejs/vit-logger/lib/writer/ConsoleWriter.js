"use strict";

var _slicedToArray = function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; for (var _iterator = arr[Symbol.iterator](), _step; !(_step = _iterator.next()).done;) { _arr.push(_step.value); if (i && _arr.length === i) break; } return _arr; } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
  value: true
});
//imports
var vlog = require("../..");
var Writer = vlog.Writer;
var Level = vlog.Level;

/**
 * A console writer.
 *
 * @readonly console:any  The console object with the log/warn/error methods.
 */

var ConsoleWriter = exports.ConsoleWriter = (function (_Writer) {
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
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _classCallCheck(this, ConsoleWriter);

    var pat, con;

    //(1) pre: arguments
    if (args.length == 1) {
      if (typeof args[0] == "string") pat = args[0];else con = args[0];
    } else if (args.length > 1) {
      var _ref = args;

      var _ref2 = _slicedToArray(_ref, 2);

      pat = _ref2[0];
      con = _ref2[1];
    }

    if (!con) con = console;

    //(2) superconstructor
    _get(Object.getPrototypeOf(ConsoleWriter.prototype), "constructor", this).call(this, pat);

    //(3) init
    Object.defineProperty(this, "console", { value: con, enumerable: true });
  }

  _inherits(ConsoleWriter, _Writer);

  _createClass(ConsoleWriter, {
    write: {

      /**
       * @override
       */

      value: function write(entry) {
        var print;

        //(1) get print() function
        if (entry.level == Level.DEBUG || entry.level == Level.INFO) print = this.console.log;else if (entry.level == Level.WARN) print = this.console.error;else print = this.console.error;

        //(2) print
        print(this.format(entry));
      }
    }
  });

  return ConsoleWriter;
})(Writer);