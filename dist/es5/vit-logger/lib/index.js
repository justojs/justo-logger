



"use strict";

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
	value: true
});
/**
 * The log level.
 * 
 * @enum
 */

var Level = exports.Level =
/**
 * Constructor.
 * 
 * @private
 */
function Level(name, value) {
	_classCallCheck(this, Level);

	Object.defineProperty(this, "name", { value: name, enumerable: true });
	Object.defineProperty(this, "value", { value: value, enumerable: true });
};

Object.defineProperty(Level, "DEBUG", { value: new Level("DEBUG", 0), enumerable: true });
Object.defineProperty(Level, "INFO", { value: new Level("INFO", 1), enumerable: true });
Object.defineProperty(Level, "WARN", { value: new Level("WARN", 2), enumerable: true });
Object.defineProperty(Level, "ERROR", { value: new Level("ERROR", 3), enumerble: true });
Object.defineProperty(Level, "FATAL", { value: new Level("FATAL", 4), enumerable: true });

"use strict";

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
	value: true
});
/**
 * A log entry.
 * 
 * @readonly source:Logger	The logger source.
 * @readonly level:Level		The log level.
 * @readonly timestamp:date	The timestamp.
 * @readonly message:string	The message.
 */

var LogEntry = exports.LogEntry =
/**
 * Constructor.
 * 
 * @param(attr) source
 * @param(attr) level
 * @param(attr) timestamp
 * @param(attr) message
 */
function LogEntry(source, level, timestamp, message) {
	_classCallCheck(this, LogEntry);

	Object.defineProperty(this, "source", { value: source, enumerable: true });
	Object.defineProperty(this, "level", { value: level, enumerable: true });
	Object.defineProperty(this, "timestamp", { value: timestamp, enumerable: true });
	Object.defineProperty(this, "message", { value: message, enumerable: true });
};

"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
	value: true
});
/**
 * A logger.
 * 
 * @readonly parent:Logger	The parent logger.
 * @readonly name:string		The logger name.
 * @readonly minLevel:Level	The minimum level to write.
 * @readonly maxLevel:Level	The maximum level to write.
 */

var Logger = exports.Logger = (function () {
	/**
  * Constructor.
  * 
  * @overload
  * @param(attr) name
  * @param [config]:object	The logger options: minLevel and maxLevel.
  * 
  * @overload
  * @param(attr) parent
  * @param(attr) name
  * @param [config]:object	The logger options: minLevel and maxLevel.
  */

	function Logger() {
		for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
			args[_key] = arguments[_key];
		}

		_classCallCheck(this, Logger);

		var parent, name, config;

		//(1) pre: arguments
		if (args.length == 1 && typeof args[0] == "string") {
			name = args[0];
		} else if (args.length == 2) {
			if (typeof args[0] == "string") {
				name = args[0];
				config = args[1];
			} else {
				parent = args[0];
				name = args[1];
			}
		} else if (args.length > 2) {
			parent = args[0];
			name = args[1];
			config = args[2];
		}

		if (!name) throw new Error("The logger must have a name.");
		if (!config) config = {};

		//(2) init
		Object.defineProperty(this, "parent", { value: parent, enumerable: true });
		Object.defineProperty(this, "name", { value: name, enumerable: true });
		Object.defineProperty(this, "minLevel", { value: config.minLevel || Level.INFO, enumerable: true });
		Object.defineProperty(this, "maxLevel", { value: config.maxLevel || Level.FATAL, enumerable: true });
		Object.defineProperty(this, "writers", { value: [] });
	}

	_createClass(Logger, {
		qualifiedName: {

			/**
    * The qualified name.
    * 
    * @type string
    */

			get: function () {
				return (this.parent ? this.parent.qualifiedName + "." : "") + this.name;
			}
		},
		qn: {

			/**
    * @alias qualifiedName
    */

			get: function () {
				return this.qualifiedName;
			}
		},
		write: {

			/**
    * Writes a log entry.
    * 
    * @protected
    */

			value: function write(level, msg) {
				//(1) pre: arguments
				if (!level) throw new Error("Level expected.");
				if (!msg) throw new Error("Message expected.");

				//(2) emit message if needed
				if (level.value >= this.minLevel.value && level.value <= this.maxLevel.value) {
					var entry = new LogEntry(this, level, new Date(), msg);

					for (var i = 0; i < this.writers.length; ++i) {
						var writer = this.writers[i];

						if (writer instanceof Function) writer(entry);else writer.write(entry);
					}
				}
			}
		},
		onWrite: {

			/**
    * Adds a writer to listen the write event.
    * 
    * @param writer:Writer	The writer/listener.
    */

			value: function onWrite(writer) {
				if (!writer) throw new Error("Listener expected.");

				this.writers.push(writer);
			}
		},
		debug: {

			/**
    * Logs a DEBUG message.
    * 
    * @param msg:string	The message.
    */

			value: function debug(msg) {
				this.write(Level.DEBUG, msg);
			}
		},
		info: {

			/**
    * Logs an INFO message.
    * 
    * @param msg:string	The message.
    */

			value: function info(msg) {
				this.write(Level.INFO, msg);
			}
		},
		warn: {

			/**
    * Logs a WARN message.
    * 
    * @param msg:string	The message.
    */

			value: function warn(msg) {
				this.write(Level.WARN, msg);
			}
		},
		error: {

			/**
    * Logs an ERROR message.
    * 
    * @param msg:string	The message.
    */

			value: function error(msg) {
				this.write(Level.ERROR, msg);
			}
		},
		fatal: {

			/**
    * Logs a FATAL message.
    * 
    * @param msg:string	The message.
    */

			value: function fatal(msg) {
				this.write(Level.FATAL, msg);
			}
		}
	});

	return Logger;
})();

"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

//imports
var colors = require("colors");

/**
 * The painter.
 * 
 * @internal
 * 
 * @readonly(internal) debug:function
 * @readonly(internal) info:function
 * @readonly(internal) warn:function
 * @readonly(internal) error:function
 * @readonly(internal) fatal:function
 */

var Painter = (function () {
	/**
  * Constructor.
  * 
  * @param config:object	The colors.
  */

	function Painter(config) {
		_classCallCheck(this, Painter);

		Object.defineProperty(this, "DEBUG", { value: colors[config.debug], enumerable: true });
		Object.defineProperty(this, "INFO", { value: colors[config.info], enumerable: true });
		Object.defineProperty(this, "WARN", { value: colors[config.warn], enumerable: true });
		Object.defineProperty(this, "ERROR", { value: colors[config.error], enumerable: true });
		Object.defineProperty(this, "FATAL", { value: colors[config.fatal], enumerable: true });
	}

	_createClass(Painter, {
		paint: {

			/**
    * Paints the entry.
    */

			value: function paint(entry) {
				return this[entry.level.name](entry.level.name);
			}
		}
	});

	return Painter;
})();

"use strict";

var _slicedToArray = function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; for (var _iterator = arr[Symbol.iterator](), _step; !(_step = _iterator.next()).done;) { _arr.push(_step.value); if (i && _arr.length === i) break; } return _arr; } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } };

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
	value: true
});
/**
 * A writer.
 * 
 * @abstract
 * @readonly pattern:string	The format pattern.
 */

var Writer = exports.Writer = (function () {
	/**
  * Constructor.
  * 
  * @param(attr) pattern
  */

	function Writer() {
		var pattern = arguments[0] === undefined ? Writer.DEFAULT_PATTERN : arguments[0];

		_classCallCheck(this, Writer);

		Object.defineProperty(this, "pattern", { value: pattern, enumerable: true });
	}

	_createClass(Writer, {
		write: {

			/**
    * Writes a log entry.
    * 
    * @abstract
    * @param entry:LogEntry	The log entry.
    */

			value: function write(entry) {
				throw new Error("Abstract method.");
			}
		},
		format: {

			/**
    * Builds the line to write.
    * 
    * @protected
    * @param entry:LogEntry	The log entry to build.
    */

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
		},
		formatLevel: {

			/**
    * Formats the level.
    * 
    * @protected
    * @param entry:LogEntry	The entry.
    * @return string
    */

			value: function formatLevel(entry) {
				return entry.level.name;
			}
		},
		formatTimestamp: {

			/**
    * Formats a timestamp.
    * 
    * @protected
    * @param entry:LogEntry	The entry.
    * @return string
    */

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
		}
	});

	return Writer;
})();

Object.defineProperty(Writer, "DEFAULT_PATTERN", { value: "%l [%t]: %m" });

/**
 * A console writer.
 * 
 * @readonly console:any	The console object with the log/warn/error methods.
 */

var ConsoleWriter = exports.ConsoleWriter = (function (_Writer) {
	/**
  * Constructor.
  * 
  * @overload
  * @noparam
  * 
  * @overload
  * @param(attr) pattern
  * 
  * @overload
  * @param(attr) console
  * 
  * @overload
  * @protected
  * @param(attr) pattern
  * @param(attr) console
  */

	function ConsoleWriter() {
		for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
			args[_key] = arguments[_key];
		}

		_classCallCheck(this, ConsoleWriter);

		var pat, con;

		//(1) pre: arguments
		if (args.length == 1) {
			if (typeof args[0] == "string") pat = args[0];else con = args[0];
		} else if (args.length > 1) {
			var _ref = args;

			var _ref2 = _slicedToArray(_ref, 2);

			pat = _ref2[0];
			con = _ref2[1];
		}

		if (!con) con = console;

		//(2) superconstructor
		_get(Object.getPrototypeOf(ConsoleWriter.prototype), "constructor", this).call(this, pat);

		//(3) init
		Object.defineProperty(this, "console", { value: con, enumerable: true });
	}

	_inherits(ConsoleWriter, _Writer);

	_createClass(ConsoleWriter, {
		write: {

			/**
    * @override
    */

			value: function write(entry) {
				var print;

				//(1) get print() function
				if (entry.level == Level.DEBUG || entry.level == Level.INFO) print = this.console.log;else if (entry.level == Level.WARN) print = this.console.error;else print = this.console.error;

				//(2) print
				print(this.format(entry));
			}
		}
	});

	return ConsoleWriter;
})(Writer);

/**
 * A colored console writer.
 * 
 * @readonly theme:object							The theme to use.
 * @readonly(private) painter:Painter	The text painter.
 */

var ColoredConsoleWriter = exports.ColoredConsoleWriter = (function (_ConsoleWriter) {
	/**
  * Constructor.
  * 
  * @overload
  * @noparam
  * 
  * @overload
  * @param pattern:string	The format pattern.
  * 
  * @overload
  * @param theme:object		The color theme.
  * 
  * @overload
  * @param pattern:string	The format pattern.
  * @param theme:object		The color theme.
  * 
  * @overload
  * @protected
  * @param pattern:string	The format pattern.
  * @param theme:object		The color theme.
  * @param console:object	The console object.
  */

	function ColoredConsoleWriter() {
		for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
			args[_key] = arguments[_key];
		}

		_classCallCheck(this, ColoredConsoleWriter);

		var pattern, theme, console;

		//(1) pre: arguments
		if (args.length == 1) {
			if (typeof args[0] == "string") pattern = args[0];else theme = args[0];
		} else if (args.length == 2) {
			var _ref = args;

			var _ref2 = _slicedToArray(_ref, 2);

			pattern = _ref2[0];
			theme = _ref2[1];
		} else if (args.length > 2) {
			var _ref3 = args;

			var _ref32 = _slicedToArray(_ref3, 3);

			pattern = _ref32[0];
			theme = _ref32[1];
			console = _ref32[2];
		}

		theme = ColoredConsoleWriter.thematize(theme);

		//(2) superconstructor
		_get(Object.getPrototypeOf(ColoredConsoleWriter.prototype), "constructor", this).call(this, pattern, console);

		//(3) init
		Object.defineProperty(this, "theme", { value: theme, enumerable: true });
		Object.defineProperty(this, "painter", { value: new Painter(theme) });
	}

	_inherits(ColoredConsoleWriter, _ConsoleWriter);

	_createClass(ColoredConsoleWriter, {
		formatLevel: {

			/**
    * @override
    */

			value: function formatLevel(entry) {
				return this.painter.paint(entry);
			}
		},
		write: {

			/**
    * @override
    */

			value: function write(entry) {
				this.console.log(this.format(entry));
			}
		}
	}, {
		thematize: {

			/**
    * Creates the theme object to save.
    * 
    * @private
    * 
    * @param theme:object	The user theme.
    * @return object
    */

			value: function thematize(theme) {
				var DEFAULT_THEME = ColoredConsoleWriter.DEFAULT_THEME;
				var res;

				//(1) theme
				if (!theme || theme == {}) {
					res = DEFAULT_THEME;
				} else {
					res = {};
					res.debug = theme.debug || DEFAULT_THEME.debug;
					res.info = theme.info || DEFAULT_THEME.info;
					res.warn = theme.warn || DEFAULT_THEME.warn;
					res.error = theme.error || DEFAULT_THEME.error;
					res.fatal = theme.fatal || DEFAULT_THEME.fatal;
				}

				//(2) return
				return res;
			}
		}
	});

	return ColoredConsoleWriter;
})(ConsoleWriter);

Object.defineProperty(ColoredConsoleWriter, "DEFAULT_THEME", {
	value: {
		debug: "gray",
		info: "white",
		warn: "yellow",
		error: "red",
		fatal: "red"
	}
});