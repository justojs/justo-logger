/**
 * A logger.
 * 
 * @readonly parent:Logger	The parent logger.
 * @readonly name:string		The logger name.
 * @readonly minLevel:Level	The minimum level to write.
 * @readonly maxLevel:Level	The maximum level to write.
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
		Object.defineProperty(this, "minLevel", {value: config.minLevel || Level.INFO, enumerable: true});
		Object.defineProperty(this, "maxLevel", {value: config.maxLevel || Level.FATAL, enumerable: true});
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
	 * Logs a DEBUG message.
	 * 
	 * @param msg:string	The message.
	 */
	debug(msg) {
		this.write(Level.DEBUG, msg);
	}
	
	/**
	 * Logs an INFO message.
	 * 
	 * @param msg:string	The message.
	 */
	info(msg) {
		this.write(Level.INFO, msg);
	}
	
	/**
	 * Logs a WARN message.
	 * 
	 * @param msg:string	The message.
	 */
	warn(msg) {
		this.write(Level.WARN, msg);
	}
	
	/**
	 * Logs an ERROR message.
	 * 
	 * @param msg:string	The message.
	 */
	error(msg) {
		this.write(Level.ERROR, msg);
	}
	
	/**
	 * Logs a FATAL message.
	 * 
	 * @param msg:string	The message.
	 */
	fatal(msg) {
		this.write(Level.FATAL, msg);
	}
}