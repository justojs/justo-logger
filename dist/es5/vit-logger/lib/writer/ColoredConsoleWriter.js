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
var ConsoleWriter = require("vit-logger").writer.ConsoleWriter;
var colors = require("colors");

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