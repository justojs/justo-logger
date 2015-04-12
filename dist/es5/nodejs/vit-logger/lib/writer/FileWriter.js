"use strict";

var _slicedToArray = function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; for (var _iterator = arr[Symbol.iterator](), _step; !(_step = _iterator.next()).done;) { _arr.push(_step.value); if (i && _arr.length === i) break; } return _arr; } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } };

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
var vlog = require("vit-logger");
var Writer = vlog.Writer;
var Level = vlog.Level;

/**
 * A file writer.
 * 
 * @readonly dirPath:string							The directory.
 * @readonly fileName:string						The file name.
 * @readonly synchronous:boolean				Is it synchrnous?
 * @readonly batch:number								The batch size.
 * @readonly(private) trigger:Level			The batch level trigger.
 * @readonly(private) buffer:Entry[]		The entries for writing.
 * @readonly(private) encoding:string		The encoding.
 * @readonly(private) mode:number				The file mode.
 * @readonly(private) opOptions:object	The append options.
 */

var FileWriter = exports.FileWriter = (function (_Writer) {
	/**
  * Constructor.
  * 
  * @overload
  * @param(attr) dirPath		
  * @param(attr) fileName
  * @param [opts]:object			The writer options: sync and batch.
  * 
  * @overload
  * @param(attr) pattern
  * @param(attr) dirPath
  * @param(attr) fileName
  * @param [opts]:object			The writer options: sync and batch.
  */

	function FileWriter() {
		for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
			args[_key] = arguments[_key];
		}

		_classCallCheck(this, FileWriter);

		var pattern, dirPath, fileName, opts;

		//(1) pre: arguments
		if (args.length == 2) {
			var _ref = args;

			var _ref2 = _slicedToArray(_ref, 2);

			dirPath = _ref2[0];
			fileName = _ref2[1];
		} else if (args.length == 3) {
			if (typeof args[2] == "string") {
				var _ref3 = args;

				var _ref32 = _slicedToArray(_ref3, 3);

				pattern = _ref32[0];
				dirPath = _ref32[1];
				fileName = _ref32[2];
			} else {
				var _ref4 = args;

				var _ref42 = _slicedToArray(_ref4, 3);

				dirPath = _ref42[0];
				fileName = _ref42[1];
				opts = _ref42[2];
			}
		} else if (args.length > 3) {
			var _ref5 = args;

			var _ref52 = _slicedToArray(_ref5, 4);

			pattern = _ref52[0];
			dirPath = _ref52[1];
			fileName = _ref52[2];
			opts = _ref52[3];
		}

		if (!opts) opts = {};

		//(2) superconstructor
		_get(Object.getPrototypeOf(FileWriter.prototype), "constructor", this).call(this, pattern);

		//(3) init
		Object.defineProperty(this, "dirPath", { value: dirPath, enumerable: true });
		Object.defineProperty(this, "fileName", { value: fileName, enumerable: true });
		Object.defineProperty(this, "synchronous", { value: !!opts.sync, enumerable: true });
		Object.defineProperty(this, "batch", { value: opts.batch || FileWriter.DEFAULT_OPTIONS.batch });
		Object.defineProperty(this, "trigger", { value: Level.WARN });
		Object.defineProperty(this, "buffer", { value: [] });
		Object.defineProperty(this, "encoding", { value: FileWriter.DEFAULT_OPTIONS.encoding });
		Object.defineProperty(this, "mode", { value: FileWriter.DEFAULT_OPTIONS.mode });
		Object.defineProperty(this, "opOptions", { value: { encoding: this.encoding, mode: this.mode } });
	}

	_inherits(FileWriter, _Writer);

	_createClass(FileWriter, {
		sync: {

			/**
    * @alias synchrnous
    */

			get: function () {
				return this.synchronous;
			}
		},
		asynchronous: {

			/**
    * Is it asynchronous?
    * 
    * @type boolean
    */

			get: function () {
				return !this.sync;
			}
		},
		async: {

			/**
    * @alias asynchronous
    */

			get: function () {
				return this.asynchronous;
			}
		},
		filePath: {

			/**
    * The file path.
    * 
    * @return string
    */

			get: function () {
				return path.join(this.dirPath, this.fileName);
			}
		},
		buildBufferContent: {

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
		},
		write: {

			/**
    * @override
    */

			value: function write(entry) {
				//(1) push entry
				this.buffer.push(entry);

				//(2) must we write batch buffer?
				if (entry.level.value >= this.trigger.value || this.buffer.length >= this.batch) {
					this.writeBuffer();
				}
			}
		},
		writeBuffer: {

			/**
    * Writes the buffered entries.
    * 
    * @private
    */

			value: function writeBuffer() {
				var con = this.buildBufferContent();

				if (this.sync) this.writeSync(con);else this.writeAsync(con);
			}
		},
		writeSync: {

			/**
    * Writes the specified one, synchronously.
    * 
    * @protected
    * @param con:string	The content to write.
    */

			value: function writeSync(con) {
				fs.appendFileSync(this.filePath, con, this.opOptions);
			}
		},
		writeAsync: {

			/**
    * Writes the batch buffer asynchronously.
    * 
    * @protected
    * @param con:string	The content to write.
    */

			value: function writeAsync(con) {
				fs.appendFile(this.filePath, con, this.opOptions, function (error) {
					if (error) throw new Error(error);
				});
			}
		}
	});

	return FileWriter;
})(Writer);

Object.defineProperty(FileWriter, "DEFAULT_OPTIONS", {
	value: {
		sync: false,
		batch: 1,
		encoding: "utf8",
		mode: 438
	}
});