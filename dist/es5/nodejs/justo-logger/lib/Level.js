"use strict";var _createClass = function () {function defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}return function (Constructor, protoProps, staticProps) {if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;};}();Object.defineProperty(exports, "__esModule", { value: true });function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}var 




Level = function () {





  function Level(name, value) {_classCallCheck(this, Level);
    Object.defineProperty(this, "name", { value: name, enumerable: true });
    Object.defineProperty(this, "value", { value: value, enumerable: true });}_createClass(Level, null, [{ key: "parse", value: function parse(







    name) {
      return Level[name.toUpperCase()];} }]);return Level;}();exports.default = Level;



Object.defineProperty(Level, "DEBUG", { value: new Level("DEBUG", 0), enumerable: true });
Object.defineProperty(Level, "INFO", { value: new Level("INFO", 1), enumerable: true });
Object.defineProperty(Level, "WARN", { value: new Level("WARN", 2), enumerable: true });
Object.defineProperty(Level, "ERROR", { value: new Level("ERROR", 3), enumerble: true });
Object.defineProperty(Level, "FATAL", { value: new Level("FATAL", 4), enumerable: true });
