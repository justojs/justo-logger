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
 * @attr minLevel:Level			The minimum level to write.
 * @attr maxLevel:Level			The maximum level to write.
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
		Object.defineProperty(this, "minLevel", { value: config.minLevel || Level.INFO, enumerable: true, writable: true });
		Object.defineProperty(this, "maxLevel", { value: config.maxLevel || Level.FATAL, enumerable: true, writable: true });
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

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var writer = Object.defineProperties({}, {
  ConsoleWriter: {
    get: function () {
      return require("./writer/ConsoleWriter").ConsoleWriter;
    },
    configurable: true,
    enumerable: true
  },
  ColoredConsoleWriter: {
    get: function () {
      return require("./writer/ColoredConsoleWriter").ColoredConsoleWriter;
    },
    configurable: true,
    enumerable: true
  },
  FileWriter: {
    get: function () {
      return require("./writer/FileWriter").FileWriter;
    },
    configurable: true,
    enumerable: true
  }
});
exports.writer = writer;