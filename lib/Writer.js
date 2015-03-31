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