"use strict";var _createClass = function () {function defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}return function (Constructor, protoProps, staticProps) {if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;};}();Object.defineProperty(exports, "__esModule", { value: true });var _Logger2 = require("../Logger");var _Logger3 = _interopRequireDefault(_Logger2);var _Level = require("../Level");var _Level2 = _interopRequireDefault(_Level);var _util = require("./util");function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self, call) {if (!self) {throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call && (typeof call === "object" || typeof call === "function") ? call : self;}function _inherits(subClass, superClass) {if (typeof superClass !== "function" && superClass !== null) {throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;}var 









ConsoleLogger = function (_Logger) {_inherits(ConsoleLogger, _Logger);












  function ConsoleLogger() {var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];_classCallCheck(this, ConsoleLogger);

    if (!opts) opts = {};var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ConsoleLogger).call(this, 


    opts));


    Object.defineProperty(_this, "console", { value: console, writable: true });return _this;}_createClass(ConsoleLogger, [{ key: "write", value: function write(





    entry) {
      var print;


      if (entry.level == _Level2.default.DEBUG || entry.level == _Level2.default.INFO) print = this.console.log;else 
      print = this.console.error;


      print(this.format(entry));} }, { key: "format", value: function format(





    entry) {
      return (0, _util.format)(entry, this.patterns);} }]);return ConsoleLogger;}(_Logger3.default);exports.default = ConsoleLogger;
