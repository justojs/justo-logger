//imports
const fs = require("fs");
const path = require("path");
const util = require("util");
const vlog = require("vit-logger");
const FileWriter = vlog.writer.FileWriter;

/**
 * A rolling file writer.
 * 
 * @readonly maximumSize:number					The maximum size for rolling over.
 * @readonly maximumArchives:number			The maximum number of files to maintain.
 */
export class RollingFileWriter extends FileWriter {
	/**
	 * Constructor.
	 * 
	 * @overload
	 * @param(attr) dirPath		
	 * @param(attr) fileName
	 * @param [opts]:object			The writer options: batch, maxSize and maxArchives.
	 * 
	 * @overload
	 * @param(attr) pattern
	 * @param(attr) dirPath
	 * @param(attr) fileName
	 * @param [opts]:object			The writer options: batch, maxSize and maxArchives.
	 */
	constructor(...args) {
		var opts;
		
		//(1) superconstructor
		super(...args);
		
		//(2) arguments
		if (args.length == 3) {
			if (typeof(args[2]) != "string") opts = args[2];
		} else if (args.length == 4) {
			opts = args[3];
	  }
		
		opts = util._extend({}, opts);
		if (!opts.maxSize || opts.maxSize <= 0) opts.maxSize = RollingFileWriter.DEFAULT_OPTIONS.maxSize;
		if (!opts.maxArchives || opts.maxArchives <= 0) opts.maxArchives = RollingFileWriter.DEFAULT_OPTIONS.maxArchives;
		
		//(3) init
		Object.defineProperty(this, "maximumSize", {value: opts.maxSize, enumerable: true});
		Object.defineProperty(this, "maximumArchives", {value: opts.maxArchives, enumerable: true});
	}
	
	/**
	 * @alias maximumSize
	 */
	get maxSize() {
		return this.maximumSize;
	}
	
	/**
	 * @alias maximumArchives
	 */
	get maxArchives() {
		return this.maximumArchives;
	}
	
	/**
	 * Builds an archive name for an index.
	 * 
	 * @private
	 * @param ix:number	The index to build.
	 */
	buildArchiveName(ix) {
		var file;
		
		//(1) build file path
		file = path.parse(this.fileName);
		file = file.name + "-" +  ix + file.ext;
		
		//(2) return
		return file;
	}
	
	/**
	 * Builds an archive path for an index.
	 * 
	 * @private
	 * @param ix:number	The index to build.
	 */
	buildArchivePath(ix) {
		return path.join(this.dirPath, this.buildArchiveName(ix));
	}
	
	/**
	 * Rolls over the log file synchronously.
	 */
	rollOverSync() {
		//(1) shift
		for (let i = this.maxArchives - 1; i > 0; --i) {
			let arch = this.buildArchivePath(i);
			
			if (fs.existsSync(arch)) fs.renameSync(arch, this.buildArchivePath(i+1))
		}
		
		//(2) archive current file
		if (fs.existsSync(this.filePath)) fs.renameSync(this.filePath, this.buildArchivePath(1));
		fs.writeFileSync(this.filePath, "", this.opOptions);
	}
	
///**
//* Rolls over the log file asynchronously.
//* 
//* @param callback:function	The function to call: fn(error).
//*/
//rollOverAsync(callback) {
//	var self = this;
//	
//	rollOver(this.maxArchives-1);
//	
//	//helper functions
//	function rollOver(i) {
//		if (i == 0) {
//			fs.exists(self.filePath, function(exists) {
//				fs.rename(self.filePath, self.buildArchivePath(1), function(error) {
//					if (error) throw error;
//					fs.writeFile(self.filePath, "", self.opOptions, callback);
//				});
//			});
//		} else {
//			fs.exists(self.buildArchivePath(i), function(exists) {
//				if (exists) {
//					fs.rename(self.buildArchivePath(i), self.buildArchivePath(i+1), function(error) {
//						if (error) throw error;
//						rollOver(i-1);
//					});
//				} else {
//					rollOver(i-1);
//				}
//			});
//		}
//	}
//}
	
	/**
	 * @override
	 */
	writeSync(con) {
		//(1) roll over if needed
		try {
			if (fs.statSync(this.filePath).size >= this.maxSize) this.rollOverSync();
		} catch (e) {
			//pass
		}
		
		//(2) write
		super.writeSync(con);
	}
	
	/**
	 * @override
	 */
	writeAsync(con) {
		this.writeSync(con);
//		fs.stat(this.filePath, (error, stat) => {
//			if (!error && stat.size >= this.maxSize) this.rollOverSync();
//			super.writeAsync(con);
//		});
	}
}

Object.defineProperty(RollingFileWriter, "DEFAULT_OPTIONS", {
	value: {
		sync: false,
		batch: 1,
		encoding: "utf8",
		mode: 438,
		maxSize: 1048576,
		maxArchives: 1
	}
});