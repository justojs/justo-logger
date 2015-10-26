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

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _util = require("util");

var _util2 = _interopRequireDefault(_util);

var _FileWriter2 = require("./FileWriter");

var _FileWriter3 = _interopRequireDefault(_FileWriter2);

/**
 * A rolling file writer.
 *
 * @readonly maximumSize:number          The maximum size for rolling over.
 * @readonly maximumArchives:number      The maximum number of files to maintain.
 */

var RollingFileWriter = (function (_FileWriter) {
  _inherits(RollingFileWriter, _FileWriter);

  /**
   * Constructor.
   *
   * @overload
   * @param(attr) dirPath
   * @param(attr) fileName
   * @param [opts]:object      The writer options: batch, maxSize and maxArchives.
   *
   * @overload
   * @param(attr) pattern
   * @param(attr) dirPath
   * @param(attr) fileName
   * @param [opts]:object      The writer options: batch, maxSize and maxArchives.
   */

  function RollingFileWriter() {
    _classCallCheck(this, RollingFileWriter);

    var opts;

    //(1) superconstructor

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _get(Object.getPrototypeOf(RollingFileWriter.prototype), "constructor", this).apply(this, args);

    //(2) arguments
    if (args.length == 3) {
      if (typeof args[2] != "string") opts = args[2];
    } else if (args.length == 4) {
      opts = args[3];
    }

    opts = _util2["default"]._extend({}, opts);
    if (!opts.maxSize || opts.maxSize <= 0) opts.maxSize = RollingFileWriter.DEFAULT_OPTIONS.maxSize;
    if (!opts.maxArchives || opts.maxArchives <= 0) opts.maxArchives = RollingFileWriter.DEFAULT_OPTIONS.maxArchives;

    //(3) init
    Object.defineProperty(this, "maximumSize", { value: opts.maxSize, enumerable: true });
    Object.defineProperty(this, "maximumArchives", { value: opts.maxArchives, enumerable: true });
  }

  /**
   * @alias maximumSize
   */

  _createClass(RollingFileWriter, [{
    key: "buildArchiveName",

    /**
     * Builds an archive name for an index.
     *
     * @private
     * @param ix:number  The index to build.
     */
    value: function buildArchiveName(ix) {
      var file;

      //(1) build file path
      file = _path2["default"].parse(this.fileName);
      file = file.name + "-" + ix + file.ext;

      //(2) return
      return file;
    }

    /**
     * Builds an archive path for an index.
     *
     * @private
     * @param ix:number  The index to build.
     */
  }, {
    key: "buildArchivePath",
    value: function buildArchivePath(ix) {
      return _path2["default"].join(this.dirPath, this.buildArchiveName(ix));
    }

    /**
     * Rolls over the log file synchronously.
     */
  }, {
    key: "rollOverSync",
    value: function rollOverSync() {
      //(1) shift
      for (var i = this.maxArchives - 1; i > 0; --i) {
        var arch = this.buildArchivePath(i);

        if (_fs2["default"].existsSync(arch)) _fs2["default"].renameSync(arch, this.buildArchivePath(i + 1));
      }

      //(2) archive current file
      if (_fs2["default"].existsSync(this.filePath)) _fs2["default"].renameSync(this.filePath, this.buildArchivePath(1));
      _fs2["default"].writeFileSync(this.filePath, "", this.opOptions);
    }

    /**
     * @override
     */
  }, {
    key: "writeSync",
    value: function writeSync(con) {
      //(1) roll over if needed
      try {
        if (_fs2["default"].statSync(this.filePath).size >= this.maxSize) this.rollOverSync();
      } catch (e) {}
      //pass

      //(2) write
      _get(Object.getPrototypeOf(RollingFileWriter.prototype), "writeSync", this).call(this, con);
    }

    /**
     * @override
     */
  }, {
    key: "writeAsync",
    value: function writeAsync(con) {
      this.writeSync(con);
    }
  }, {
    key: "maxSize",
    get: function get() {
      return this.maximumSize;
    }

    /**
     * @alias maximumArchives
     */
  }, {
    key: "maxArchives",
    get: function get() {
      return this.maximumArchives;
    }
  }]);

  return RollingFileWriter;
})(_FileWriter3["default"]);

exports["default"] = RollingFileWriter;

Object.defineProperty(RollingFileWriter, "DEFAULT_OPTIONS", {
  value: {
    sync: false,
    batch: 1,
    encoding: "utf8",
    mode: 438,
    maxSize: 1048576,
    maxArchives: 1
  }
});
module.exports = exports["default"];
