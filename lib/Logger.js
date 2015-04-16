//imports
const util = require("util");

/**
 * A logger.
 *
 * @readonly parent:Logger	The parent logger.
 * @readonly name:string		The logger name.
 * @attr minLevel:Level			The minimum level to write.
 * @attr maxLevel:Level			The maximum level to write.
 */
export class Logger {
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
	constructor(...args) {
		var parent, name, config;

		//(1) pre: arguments
		if (args.length == 1 && typeof(args[0]) == "string") {
			name = args[0];
		} else if (args.length == 2) {
			if (typeof(args[0]) == "string") {
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
		Object.defineProperty(this, "parent", {value: parent, enumerable: true});
		Object.defineProperty(this, "name", {value: name, enumerable: true});
		Object.defineProperty(this, "minLevel", {value: config.minLevel || Level.INFO, enumerable: true, writable: true});
		Object.defineProperty(this, "maxLevel", {value: config.maxLevel || Level.FATAL, enumerable: true, writable: true});
		Object.defineProperty(this, "writers", {value: []});
	}

	/**
	 * The qualified name.
	 *
	 * @type string
	 */
	get qualifiedName() {
		return (this.parent ? this.parent.qualifiedName + ".": "") + this.name;
	}

	/**
	 * @alias qualifiedName
	 */
	get qn() {
		return this.qualifiedName;
	}

	/**
	 * Writes a log entry.
	 *
	 * @protected
	 */
	write(level, msg) {
		//(1) pre: arguments
		if (!level) throw new Error("Level expected.");
		if (!msg) throw new Error("Message expected.");

		//(2) emit message if needed
		if (level.value >= this.minLevel.value && level.value <= this.maxLevel.value) {
			let entry = new LogEntry(this, level, new Date(), msg);

			for (let i = 0; i < this.writers.length; ++i) {
				let writer = this.writers[i];

				if (writer instanceof Function) writer(entry);
				else writer.write(entry);
			}
		}
	}

	/**
	 * Adds a writer to listen the write event.
	 *
	 * @param writer:Writer	The writer/listener.
	 */
	onWrite(writer) {
		if (!writer) throw new Error("Listener expected.");

		this.writers.push(writer);
	}

	/**
	 * Formats the message.
	 *
	 * @private
	 *
	 * @overload
	 * @param msg:string			The message.
	 *
	 * @overload Using util.format() format.
	 * @param format:string		The format pattern.
	 * @param params:object[]	The parameters.
	 */
	format(...args) {
		var res;

		//(1) format
		if (args.length === 0) res = "";
    else if (args.length == 1) res = args[0];
		else res = util.format(args[0], ...(args.slice(1)));

		//(2) return
		return res;
	}

	/**
	 * Logs a DEBUG message.
	 *
	 * @overload
	 * @param msg:string			The message.
	 *
	 * @overload Using util.format() format.
	 * @param format:string		The format pattern.
	 * @param params:object[]	The parameters.
	 */
	debug(...args) {
		this.write(Level.DEBUG, this.format(...args));
	}

	/**
	 * Logs an INFO message.
	 *
   * @overload
	 * @param msg:string			The message.
	 *
	 * @overload Using util.format() format.
	 * @param format:string		The format pattern.
	 * @param params:object[]	The parameters.
	 */
	info(...args) {
		this.write(Level.INFO, this.format(...args));
	}

	/**
	 * Logs a WARN message.
	 *
	 * @overload
	 * @param msg:string			The message.
	 *
	 * @overload Using util.format() format.
	 * @param format:string		The format pattern.
	 * @param params:object[]	The parameters.
	 */
	warn(...args) {
		this.write(Level.WARN, this.format(...args));
	}

	/**
	 * Logs an ERROR message.
	 *
	 * @overload
	 * @param msg:string			The message.
	 *
	 * @overload Using util.format() format.
	 * @param format:string		The format pattern.
	 * @param params:object[]	The parameters.
	 */
	error(...args) {
		this.write(Level.ERROR, this.format(...args));
	}

	/**
	 * Logs a FATAL message.
	 *
	 * @overload
	 * @param msg:string			The message.
	 *
	 * @overload Using util.format() format.
	 * @param format:string		The format pattern.
	 * @param params:object[]	The parameters.
	 */
	fatal(...args) {
		this.write(Level.FATAL, this.format(...args));
	}
}
