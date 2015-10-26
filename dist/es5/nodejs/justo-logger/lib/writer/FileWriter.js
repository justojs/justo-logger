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

var _Writer2 = require("../Writer");

var _Writer3 = _interopRequireDefault(_Writer2);

var _Level = require("../Level");

var _Level2 = _interopRequireDefault(_Level);

/**
 * A file writer.
 *
 * @readonly dirPath:string              The directory.
 * @readonly fileName:string            The file name.
 * @readonly synchronous:boolean        Is it synchrnous?
 * @readonly batch:number                The batch size.
 * @readonly(private) trigger:Level      The batch level trigger.
 * @readonly(private) buffer:Entry[]    The entries for writing.
 * @readonly(private) encoding:string    The encoding.
 * @readonly(private) mode:number        The file mode.
 * @readonly(private) opOptions:object  The append options.
 */

var FileWriter = (function (_Writer) {
  _inherits(FileWriter, _Writer);

  /**
   * Constructor.
   *
   * @overload
   * @param(attr) dirPath
   * @param(attr) fileName
   * @param [opts]:object      The writer options: sync and batch.
   *
   * @overload
   * @param(attr) pattern
   * @param(attr) dirPath
   * @param(attr) fileName
   * @param [opts]:object      The writer options: sync and batch.
   */

  function FileWriter() {
    _classCallCheck(this, FileWriter);

    var pattern, dirPath, fileName, opts;

    //(1) pre: arguments

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    if (args.length == 2) {
      dirPath = args[0];
      fileName = args[1];
    } else if (args.length == 3) {
      if (typeof args[2] == "string") {
        ;
        pattern = args[0];
        dirPath = args[1];
        fileName = args[2];
      } else {
        ;
        dirPath = args[0];
        fileName = args[1];
        opts = args[2];
      }
    } else if (args.length > 3) {
      pattern = args[0];
      dirPath = args[1];
      fileName = args[2];
      opts = args[3];
    }

    if (!opts) opts = {};

    //(2) superconstructor
    _get(Object.getPrototypeOf(FileWriter.prototype), "constructor", this).call(this, pattern);

    //(3) init
    Object.defineProperty(this, "dirPath", { value: dirPath, enumerable: true });
    Object.defineProperty(this, "fileName", { value: fileName, enumerable: true });
    Object.defineProperty(this, "synchronous", { value: !!opts.sync, enumerable: true });
    Object.defineProperty(this, "batch", { value: opts.batch || FileWriter.DEFAULT_OPTIONS.batch });
    Object.defineProperty(this, "trigger", { value: _Level2["default"].WARN });
    Object.defineProperty(this, "buffer", { value: [] });
    Object.defineProperty(this, "encoding", { value: FileWriter.DEFAULT_OPTIONS.encoding });
    Object.defineProperty(this, "mode", { value: FileWriter.DEFAULT_OPTIONS.mode });
    Object.defineProperty(this, "opOptions", { value: { encoding: this.encoding, mode: this.mode } });
  }

  /**
   * @alias synchrnous
   */

  _createClass(FileWriter, [{
    key: "buildBufferContent",

    /**
     * @private
     */
    value: function buildBufferContent() {
      var con;

      //(1) build content
      con = "";

      while (this.buffer.length > 0) {
        con += this.format(this.buffer.shift()) + "\n";
      }

      //(2) return
      return con;
    }

    /**
     * @override
     */
  }, {
    key: "write",
    value: function write(entry) {
      //(1) push entry
      this.buffer.push(entry);

      //(2) must we write batch buffer?
      if (entry.level.value >= this.trigger.value || this.buffer.length >= this.batch) {
        this.writeBuffer();
      }
    }

    /**
     * Writes the buffered entries.
     *
     * @private
     */
  }, {
    key: "writeBuffer",
    value: function writeBuffer() {
      var con = this.buildBufferContent();

      if (this.sync) this.writeSync(con);else this.writeAsync(con);
    }

    /**
     * Writes the specified one, synchronously.
     *
     * @protected
     * @param con:string  The content to write.
     */
  }, {
    key: "writeSync",
    value: function writeSync(con) {
      _fs2["default"].appendFileSync(this.filePath, con, this.opOptions);
    }

    /**
     * Writes the batch buffer asynchronously.
     *
     * @protected
     * @param con:string  The content to write.
     */
  }, {
    key: "writeAsync",
    value: function writeAsync(con) {
      _fs2["default"].appendFile(this.filePath, con, this.opOptions, function (error) {
        if (error) throw new Error(error);
      });
    }
  }, {
    key: "sync",
    get: function get() {
      return this.synchronous;
    }

    /**
     * Is it asynchronous?
     *
     * @type boolean
     */
  }, {
    key: "asynchronous",
    get: function get() {
      return !this.sync;
    }

    /**
     * @alias asynchronous
     */
  }, {
    key: "async",
    get: function get() {
      return this.asynchronous;
    }

    /**
     * The file path.
     *
     * @return string
     */
  }, {
    key: "filePath",
    get: function get() {
      return _path2["default"].join(this.dirPath, this.fileName);
    }
  }]);

  return FileWriter;
})(_Writer3["default"]);

exports["default"] = FileWriter;

Object.defineProperty(FileWriter, "DEFAULT_OPTIONS", {
  value: {
    sync: false,
    batch: 1,
    encoding: "utf8",
    mode: 438
  }
});
module.exports = exports["default"];
