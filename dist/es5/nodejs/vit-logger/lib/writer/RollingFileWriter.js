"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
  value: true
});
//imports
var fs = require("fs");
var path = require("path");
var util = require("util");
var vlog = require("../..");
var FileWriter = vlog.writer.FileWriter;

/**
 * A rolling file writer.
 *
 * @readonly maximumSize:number          The maximum size for rolling over.
 * @readonly maximumArchives:number      The maximum number of files to maintain.
 */

var RollingFileWriter = exports.RollingFileWriter = (function (_FileWriter) {
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
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _classCallCheck(this, RollingFileWriter);

    var opts;

    //(1) superconstructor
    _get(Object.getPrototypeOf(RollingFileWriter.prototype), "constructor", this).apply(this, args);

    //(2) arguments
    if (args.length == 3) {
      if (typeof args[2] != "string") opts = args[2];
    } else if (args.length == 4) {
      opts = args[3];
    }

    opts = util._extend({}, opts);
    if (!opts.maxSize || opts.maxSize <= 0) opts.maxSize = RollingFileWriter.DEFAULT_OPTIONS.maxSize;
    if (!opts.maxArchives || opts.maxArchives <= 0) opts.maxArchives = RollingFileWriter.DEFAULT_OPTIONS.maxArchives;

    //(3) init
    Object.defineProperty(this, "maximumSize", { value: opts.maxSize, enumerable: true });
    Object.defineProperty(this, "maximumArchives", { value: opts.maxArchives, enumerable: true });
  }

  _inherits(RollingFileWriter, _FileWriter);

  _createClass(RollingFileWriter, {
    maxSize: {

      /**
       * @alias maximumSize
       */

      get: function () {
        return this.maximumSize;
      }
    },
    maxArchives: {

      /**
       * @alias maximumArchives
       */

      get: function () {
        return this.maximumArchives;
      }
    },
    buildArchiveName: {

      /**
       * Builds an archive name for an index.
       *
       * @private
       * @param ix:number  The index to build.
       */

      value: function buildArchiveName(ix) {
        var file;

        //(1) build file path
        file = path.parse(this.fileName);
        file = file.name + "-" + ix + file.ext;

        //(2) return
        return file;
      }
    },
    buildArchivePath: {

      /**
       * Builds an archive path for an index.
       *
       * @private
       * @param ix:number  The index to build.
       */

      value: function buildArchivePath(ix) {
        return path.join(this.dirPath, this.buildArchiveName(ix));
      }
    },
    rollOverSync: {

      /**
       * Rolls over the log file synchronously.
       */

      value: function rollOverSync() {
        //(1) shift
        for (var i = this.maxArchives - 1; i > 0; --i) {
          var arch = this.buildArchivePath(i);

          if (fs.existsSync(arch)) fs.renameSync(arch, this.buildArchivePath(i + 1));
        }

        //(2) archive current file
        if (fs.existsSync(this.filePath)) fs.renameSync(this.filePath, this.buildArchivePath(1));
        fs.writeFileSync(this.filePath, "", this.opOptions);
      }
    },
    writeSync: {

      ///**
      //* Rolls over the log file asynchronously.
      //*
      //* @param callback:function  The function to call: fn(error).
      //*/
      //rollOverAsync(callback) {
      //  var self = this;
      //
      //  rollOver(this.maxArchives-1);
      //
      //  //helper functions
      //  function rollOver(i) {
      //    if (i == 0) {
      //      fs.exists(self.filePath, function(exists) {
      //        fs.rename(self.filePath, self.buildArchivePath(1), function(error) {
      //          if (error) throw error;
      //          fs.writeFile(self.filePath, "", self.opOptions, callback);
      //        });
      //      });
      //    } else {
      //      fs.exists(self.buildArchivePath(i), function(exists) {
      //        if (exists) {
      //          fs.rename(self.buildArchivePath(i), self.buildArchivePath(i+1), function(error) {
      //            if (error) throw error;
      //            rollOver(i-1);
      //          });
      //        } else {
      //          rollOver(i-1);
      //        }
      //      });
      //    }
      //  }
      //}

      /**
       * @override
       */

      value: function writeSync(con) {
        //(1) roll over if needed
        try {
          if (fs.statSync(this.filePath).size >= this.maxSize) this.rollOverSync();
        } catch (e) {}

        //(2) write
        _get(Object.getPrototypeOf(RollingFileWriter.prototype), "writeSync", this).call(this, con);
      }
    },
    writeAsync: {

      /**
       * @override
       */

      value: function writeAsync(con) {
        this.writeSync(con);
        //    fs.stat(this.filePath, (error, stat) => {
        //      if (!error && stat.size >= this.maxSize) this.rollOverSync();
        //      super.writeAsync(con);
        //    });
      }
    }
  });

  return RollingFileWriter;
})(FileWriter);

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

//pass