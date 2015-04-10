//imports
const fs = require("fs");
const path = require("path");
const Writer = require("vit-logger").Writer;

/**
 * A file writer.
 * 
 * @readonly dirPath:string							The directory.
 * @readonly fileName:string						The file name.
 * @readonly synchronous:boolean				Is it synchrnous?
 * @readonly(private) encoding:string		The encoding.
 * @readonly(private) mode:number				The file mode.
 * @readonly(private) opOptions:object	The append options.
 */
export class FileWriter extends Writer {
	/**
	 * Constructor.
	 * 
	 * @overload
	 * @param(attr) dirPath		
	 * @param(attr) fileName
	 * @param [opts]:object			The writer options: sync.
	 * 
	 * @overload
	 * @param(attr) pattern
	 * @param(attr) dirPath
	 * @param(attr) fileName
	 * @param [opts]:object			The writer options: sync.
	 */
	constructor(...args) {
		var pattern, dirPath, fileName, opts;
		
		//(1) pre: arguments
		if (args.length == 2) {
			[dirPath, fileName] = args;
		} else if (args.length == 3) {
			if (typeof(args[2]) == "string") [pattern, dirPath, fileName] = args;
			else [dirPath, fileName, opts] = args;
		} else if (args.length > 3) {
			[pattern, dirPath, fileName, opts] = args;
		}
		
		if (!opts) opts = {};
		
		//(2) superconstructor
		super(pattern);
		
		//(3) init
		Object.defineProperty(this, "dirPath", {value: dirPath, enumerable: true});
		Object.defineProperty(this, "fileName", {value: fileName, enumerable: true});
		Object.defineProperty(this, "synchronous", {value: !!opts.sync, enumerable: true});
		Object.defineProperty(this, "encoding", {value: FileWriter.DEFAULT_OPTIONS.encoding});
		Object.defineProperty(this, "mode", {value: FileWriter.DEFAULT_OPTIONS.mode});
		Object.defineProperty(this, "opOptions", {value: {encoding: this.encoding, mode: this.mode}});
	}
	
	/**
	 * @alias synchrnous
	 */
	get sync() {
		return this.synchronous;
	}
	
	/**
	 * Is it asynchronous?
	 * 
	 * @type boolean
	 */
	get asynchronous() {
		return !this.sync;
	}
	
	/**
	 * @alias asynchronous
	 */
	get async() {
		return this.asynchronous;
	}
	
	/**
	 * The file path.
	 * 
	 * @return string
	 */
	get filePath() {
		return path.join(this.dirPath, this.fileName);
	}
	
	/**
	 * @override
	 */
	write(entry) {
		var line;
		
		//(1) build line
		line = this.format(entry) + "\n";
		
		//(2) append
		if (this.sync) {
			fs.appendFileSync(this.filePath, line, this.opOptions);
		} else {
			fs.appendFile(this.filePath, line, this.opOptions, function(error) {
				if (error) throw new Error(error);
			});
		}
	}
}

Object.defineProperty(FileWriter, "DEFAULT_OPTIONS", {
	value: {
		sync: false,
		encoding: "utf8",
		mode: 438
	}
});