//imports
const colors = require("colors");

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
class Painter {
	/**
	 * Constructor.
	 * 
	 * @param config:object	The colors.
	 */
	constructor(config) {
		Object.defineProperty(this, "DEBUG", {value: colors[config.debug], enumerable: true});
		Object.defineProperty(this, "INFO", {value: colors[config.info], enumerable: true});
		Object.defineProperty(this, "WARN", {value: colors[config.warn], enumerable: true});
		Object.defineProperty(this, "ERROR", {value: colors[config.error], enumerable: true});
		Object.defineProperty(this, "FATAL", {value: colors[config.fatal], enumerable: true});
	}
	
	/**
	 * Paints the entry.
	 */
	paint(entry) {
		return this[entry.level.name](entry.level.name);
	} 
}