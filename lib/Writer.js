/**
 * A writer.
 * 
 * @abstract
 * @readonly pattern:string	The format pattern.
 */
export class Writer {
	/**
	 * Constructor.
	 * 
	 * @param(attr) pattern
	 */
	constructor(pattern = Writer.DEFAULT_PATTERN) {
		Object.defineProperty(this, "pattern", {value: pattern, enumerable: true});
	}
	
	/**
	 * Writes a log entry.
	 * 
	 * @abstract
	 * @param entry:LogEntry	The log entry.
	 */
	write(entry) {
		throw new Error("Abstract method.");
	}
	
	/**
	 * Builds the line to write.
	 * 
	 * @protected
	 * @param entry:LogEntry	The log entry to build.
	 */
	format(entry) {
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
	 * @param entry:LogEntry	The entry.
	 * @return string
	 */
	formatLevel(entry) {
		return entry.level.name;
	}
	
	/**
	 * Formats a timestamp.
	 * 
	 * @protected
	 * @param entry:LogEntry	The entry.
	 * @return string
	 */
	formatTimestamp(entry) {
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

Object.defineProperty(Writer, "DEFAULT_PATTERN", {value: "%l [%t]: %m"});

/**
 * A console writer.
 * 
 * @readonly console:any	The console object with the log/warn/error methods.
 */
export class ConsoleWriter extends Writer {
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
	constructor(...args) {
		var pat, con;
		
		//(1) pre: arguments
		if (args.length == 1) {
			if (typeof(args[0]) == "string") pat = args[0];
			else con = args[0];
		} else if (args.length > 1) {
			[pat, con] = args;
		}
		
		if (!con) con = console;
		
		//(2) superconstructor
		super(pat);
		
		//(3) init
		Object.defineProperty(this, "console", {value: con, enumerable: true});
	};
	
	/**
	 * @override
	 */
	write(entry) {
		var print;
		
		//(1) get print() function
		if (entry.level == Level.DEBUG || entry.level == Level.INFO) print = this.console.log;
		else if (entry.level == Level.WARN) print = this.console.error;
		else print = this.console.error;
		
		//(2) print
		print(this.format(entry));
	}
}

/**
 * A colored console writer.
 * 
 * @readonly theme:object							The theme to use.
 * @readonly(private) painter:Painter	The text painter.
 */
export class ColoredConsoleWriter extends ConsoleWriter {
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
	constructor(...args) {
		var pattern, theme, console;
		
		//(1) pre: arguments
		if (args.length == 1) {
			if (typeof(args[0]) == "string") pattern = args[0];
			else theme = args[0];
		} else if (args.length == 2) {
			[pattern, theme] = args;
		} else if (args.length > 2) {
			[pattern, theme, console] = args;
		}
		
		theme = ColoredConsoleWriter.thematize(theme);
		
		//(2) superconstructor
		super(pattern, console);
		
		//(3) init
		Object.defineProperty(this, "theme", {value: theme, enumerable: true});
		Object.defineProperty(this, "painter", {value: new Painter(theme)});
	}
	
	/**
	 * Creates the theme object to save.
	 * 
	 * @private
	 * 
	 * @param theme:object	The user theme.
	 * @return object
	 */
	static thematize(theme) {
		const DEFAULT_THEME = ColoredConsoleWriter.DEFAULT_THEME;
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
	
	/**
	 * @override
	 */
	formatLevel(entry) {
		return this.painter.paint(entry);
	}
	
	/**
	 * @override
	 */
	write(entry) {
		this.console.log(this.format(entry));
	}
}

Object.defineProperty(ColoredConsoleWriter, "DEFAULT_THEME", {
	value: {
		debug: "gray",
		info: "white",
		warn: "yellow",
		error: "red",
		fatal: "red"
	}
});