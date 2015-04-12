//imports
const vlog = require("vit-logger"); 
const Writer = vlog.Writer;
const Level = vlog.Level;

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
	}
	
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