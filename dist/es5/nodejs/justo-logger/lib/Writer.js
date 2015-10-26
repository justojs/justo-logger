/**
 * A writer.
 *
 * @abstract
 * @readonly pattern:string  The format pattern.
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Writer = (function () {
  /**
   * Constructor.
   *
   * @param(attr) pattern
   */

  function Writer() {
    var pattern = arguments.length <= 0 || arguments[0] === undefined ? Writer.DEFAULT_PATTERN : arguments[0];

    _classCallCheck(this, Writer);

    Object.defineProperty(this, "pattern", { value: pattern, enumerable: true });
  }

  /**
   * Writes a log entry.
   *
   * @abstract
   * @param entry:LogEntry  The log entry.
   */

  _createClass(Writer, [{
    key: "write",
    value: function write(entry) {
      throw new Error("Abstract method.");
    }

    /**
     * Builds the line to write.
     *
     * @protected
     * @param entry:LogEntry  The log entry to build.
     */
  }, {
    key: "format",
    value: function format(entry) {
      var line;

      //(1) format
      line = this.pattern;
      line = line.replace("%l", this.formatLevel(entry));
      line = line.replace("%s", entry.source.qn);
      line = line.replace("%t", this.formatTimestamp(entry));
      line = line.replace("%m", entry.message);

      //(2) return
      return line;
    }

    /**
     * Formats the level.
     *
     * @protected
     * @param entry:LogEntry  The entry.
     * @return string
     */
  }, {
    key: "formatLevel",
    value: function formatLevel(entry) {
      return entry.level.name;
    }

    /**
     * Formats a timestamp.
     *
     * @protected
     * @param entry:LogEntry  The entry.
     * @return string
     */
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

Object.defineProperty(Writer, "DEFAULT_PATTERN", { value: "%l [%t]: %m" });
module.exports = exports["default"];
