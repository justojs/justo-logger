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

var RollingFileWriter = (function (_FileWriter) {
  _inherits(RollingFileWriter, _FileWriter);

  function RollingFileWriter() {
    _classCallCheck(this, RollingFileWriter);

    var opts;

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _get(Object.getPrototypeOf(RollingFileWriter.prototype), "constructor", this).apply(this, args);

    if (args.length == 3) {
      if (typeof args[2] != "string") opts = args[2];
    } else if (args.length == 4) {
      opts = args[3];
    }

    opts = _util2["default"]._extend({}, opts);
    if (!opts.maxSize || opts.maxSize <= 0) opts.maxSize = RollingFileWriter.DEFAULT_OPTIONS.maxSize;
    if (!opts.maxArchives || opts.maxArchives <= 0) opts.maxArchives = RollingFileWriter.DEFAULT_OPTIONS.maxArchives;

    Object.defineProperty(this, "maximumSize", { value: opts.maxSize, enumerable: true });
    Object.defineProperty(this, "maximumArchives", { value: opts.maxArchives, enumerable: true });
  }

  _createClass(RollingFileWriter, [{
    key: "buildArchiveName",
    value: function buildArchiveName(ix) {
      var file;

      file = _path2["default"].parse(this.fileName);
      file = file.name + "-" + ix + file.ext;

      return file;
    }
  }, {
    key: "buildArchivePath",
    value: function buildArchivePath(ix) {
      return _path2["default"].join(this.dirPath, this.buildArchiveName(ix));
    }
  }, {
    key: "rollOverSync",
    value: function rollOverSync() {
      for (var i = this.maxArchives - 1; i > 0; --i) {
        var arch = this.buildArchivePath(i);

        if (_fs2["default"].existsSync(arch)) _fs2["default"].renameSync(arch, this.buildArchivePath(i + 1));
      }

      if (_fs2["default"].existsSync(this.filePath)) _fs2["default"].renameSync(this.filePath, this.buildArchivePath(1));
      _fs2["default"].writeFileSync(this.filePath, "", this.opOptions);
    }
  }, {
    key: "writeSync",
    value: function writeSync(con) {
      try {
        if (_fs2["default"].statSync(this.filePath).size >= this.maxSize) this.rollOverSync();
      } catch (e) {}

      _get(Object.getPrototypeOf(RollingFileWriter.prototype), "writeSync", this).call(this, con);
    }
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
