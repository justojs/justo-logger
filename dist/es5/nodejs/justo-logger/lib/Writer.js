"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DEFAULT_PATTERNS = {
  debug: "%l [%t]: %m",
  info: "%l [%t]: %m",
  warn: "%l [%t]: %m",
  error: "%l [%t]: %m",
  fatal: "%l [%t]: %m"
};

var Writer = (function () {
  function Writer(patterns) {
    _classCallCheck(this, Writer);

    if (typeof patterns == "string") {
      patterns = {
        debug: patterns,
        info: patterns,
        warn: patterns,
        error: patterns,
        fatal: patterns
      };
    }

    Object.defineProperty(this, "patterns", { value: Object.assign(DEFAULT_PATTERNS, patterns), enumerable: true });
  }

  _createClass(Writer, [{
    key: "write",
    value: function write(entry) {
      throw new Error("Abstract method.");
    }
  }, {
    key: "format",
    value: function format(entry) {
      var line;

      line = this.patterns[entry.level.name.toLowerCase()];
      line = line.replace("%l", this.formatLevel(entry));
      line = line.replace("%s", entry.source.qn);
      line = line.replace("%t", this.formatTimestamp(entry));
      line = line.replace("%m", entry.message);

      return line;
    }
  }, {
    key: "formatLevel",
    value: function formatLevel(entry) {
      return entry.level.name;
    }
  }, {
    key: "formatTimestamp",
    value: function formatTimestamp(entry) {
      var ts, day, mon, year, hour, min, sec;

      ts = entry.timestamp;

      day = ts.getDate();
      mon = ts.getMonth() + 1;
      year = ts.getFullYear();
      hour = ts.getHours();
      min = ts.getMinutes();
      sec = ts.getSeconds();

      if (day < 10) day = "0" + day;
      if (mon < 10) mon = "0" + mon;
      if (hour < 10) hour = "0" + hour;
      if (min < 10) min = "0" + min;
      if (sec < 10) min = "0" + sec;

      return year + "-" + mon + "-" + day + " " + hour + ":" + min + ":" + sec;
    }
  }]);

  return Writer;
})();

exports["default"] = Writer;

Object.defineProperty(Writer, "DEFAULT_PATTERNS", { value: DEFAULT_PATTERNS });
module.exports = exports["default"];
