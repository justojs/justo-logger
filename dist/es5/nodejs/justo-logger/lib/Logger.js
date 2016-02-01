"use strict";var _createClass = function () {function defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}return function (Constructor, protoProps, staticProps) {if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;};}();Object.defineProperty(exports, "__esModule", { value: true });var _Level = require("./Level");var _Level2 = _interopRequireDefault(_Level);var _LogEntry = require("./LogEntry");var _LogEntry2 = _interopRequireDefault(_LogEntry);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}



var DEFAULT_OPTIONS = { 
  name: "logger", 
  enabled: true, 
  minLevel: _Level2.default.INFO, 
  maxLevel: _Level2.default.FATAL, 
  pattern: "%l [%t]: %m", 
  patterns: { 
    debug: "%l [%t]: %m", 
    info: "%l [%t]: %m", 
    warn: "%l [%t]: %m", 
    error: "%l [%t]: %m", 
    fatal: "%l [%t]: %m" } };




var write = Symbol();var 












Logger = function () {












  function Logger() {var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];_classCallCheck(this, Logger);

    if (typeof opts == "string") {
      opts = { name: opts };}


    if (!opts) {
      opts = Object.assign({}, DEFAULT_OPTIONS);} else 
    {
      var aux = Object.assign({}, DEFAULT_OPTIONS, opts);

      if (opts.hasOwnProperty("pattern")) {
        var pattern = opts.pattern;

        if (opts.hasOwnProperty("patterns")) {
          if (!opts.patterns.hasOwnProperty("debug")) aux.patterns.debug = pattern;
          if (!opts.patterns.hasOwnProperty("info")) aux.patterns.info = pattern;
          if (!opts.patterns.hasOwnProperty("warn")) aux.patterns.warn = pattern;
          if (!opts.patterns.hasOwnProperty("error")) aux.patterns.error = pattern;
          if (!opts.patterns.hasOwnProperty("fatal")) aux.patterns.fatal = pattern;} else 
        {
          aux.patterns.debug = pattern;
          aux.patterns.info = pattern;
          aux.patterns.warn = pattern;
          aux.patterns.error = pattern;
          aux.patterns.fatal = pattern;}}



      if (typeof aux.minLevel == "string") aux.minLevel = _Level2.default.parse(aux.minLevel);
      if (typeof aux.maxLevel == "string") aux.maxLevel = _Level2.default.parse(aux.maxLevel);

      opts = aux;}



    Object.defineProperty(this, "name", { value: opts.name, enumerable: true });
    Object.defineProperty(this, "enabled", { value: opts.enabled, enumerable: true });
    Object.defineProperty(this, "minLevel", { value: opts.minLevel, enumerable: true });
    Object.defineProperty(this, "maxLevel", { value: opts.maxLevel, enumerable: true });
    Object.defineProperty(this, "patterns", { value: opts.patterns, enumerable: true });}_createClass(Logger, [{ key: "write", value: function write(



















    entry) {
      throw new Error("Abstract method.");} }, { key: 







    write, value: function value(level, msg) {
      if (this.enabled && level.value >= this.minLevel.value && level.value <= this.maxLevel.value) {
        this.write(new _LogEntry2.default(this, level, new Date(), msg.join(" ")));}} }, { key: "debug", value: function debug() 









    {for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {args[_key] = arguments[_key];}
      this[write](_Level2.default.DEBUG, args);} }, { key: "info", value: function info() 








    {for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {args[_key2] = arguments[_key2];}
      this[write](_Level2.default.INFO, args);} }, { key: "warn", value: function warn() 








    {for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {args[_key3] = arguments[_key3];}
      this[write](_Level2.default.WARN, args);} }, { key: "error", value: function error() 








    {for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {args[_key4] = arguments[_key4];}
      this[write](_Level2.default.ERROR, args);} }, { key: "fatal", value: function fatal() 








    {for (var _len5 = arguments.length, args = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {args[_key5] = arguments[_key5];}
      this[write](_Level2.default.FATAL, args);} }, { key: "disabled", get: function get() {return !this.enabled;} }], [{ key: "DEFAULT_OPTIONS", get: function get() 


    {
      return DEFAULT_OPTIONS;} }]);return Logger;}();exports.default = Logger;
