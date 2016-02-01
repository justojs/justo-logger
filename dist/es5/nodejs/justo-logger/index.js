"use strict";Object.defineProperty(exports, "__esModule", { value: true });var _Level = require("./lib/Level");Object.defineProperty(exports, "Level", { enumerable: true, get: function get() {return _interopRequireDefault(_Level).default;} });var _LogEntry = require("./lib/LogEntry");Object.defineProperty(exports, "LogEntry", { enumerable: true, get: function get() {return _interopRequireDefault(_LogEntry).
    default;} });var _Loggers = require("./lib/Loggers");Object.defineProperty(exports, "Loggers", { enumerable: true, get: function get() {return _interopRequireDefault(_Loggers).
    default;} });var _Logger = require("./lib/Logger");Object.defineProperty(exports, "Logger", { enumerable: true, get: function get() {return _interopRequireDefault(_Logger).
    default;} });function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}
var logger = exports.logger = { 
  get ConsoleLogger() {
    "use strict";
    return require("./lib/logger/ConsoleLogger").default;}, 


  get ColoredConsoleLogger() {
    "use strict";
    return require("./lib/logger/ColoredConsoleLogger").default;}, 


  get FileLogger() {
    "use strict";
    return require("./lib/logger/FileLogger").default;}, 


  get RollingFileLogger() {
    "use strict";
    return require("./lib/logger/RollingFileLogger").default;} };
