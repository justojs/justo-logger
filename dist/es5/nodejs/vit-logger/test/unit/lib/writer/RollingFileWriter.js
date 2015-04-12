//imports
const os = require("os");
const fs = require("fs");
const path = require("path");
const async = require("async");
const vlog = require("vit-logger");
const RollingFileWriter = require("vit-logger").writer.RollingFileWriter;
const LogEntry = vlog.LogEntry;
const Level = vlog.Level;

//suite
describe("writer.RollingFileWriter", function() {
	const TMP_DIR = os.tmpdir();
	const FILE_NAME = "test.log";
	const SLEEP = 500; 
	const ARCHIVE_NAME1 = "test-1.log";
	const ARCHIVE_NAME2 = "test-2.log";
	var logger,
			entry, entry2, entry3, entry4, entry5, entry6, entry7, entry8,
			line, line2, line3, line4, line5, line6, line7, line8;
	
	beforeEach(function() {
		logger = {name: "app", qn: "app"};
		
		entry = new LogEntry(logger, Level.INFO, new Date(2015, 2, 30, 18, 53, 45), "My entry #1");
		entry2 = new LogEntry(logger, Level.DEBUG, new Date(2015, 2, 30, 18, 54, 13), "My entry #2");
		entry3 = new LogEntry(logger, Level.INFO, new Date(2015, 2, 30, 18, 53, 45), "My entry #3");
		entry4 = new LogEntry(logger, Level.DEBUG, new Date(2015, 2, 30, 18, 54, 13), "My entry #4");
		entry5 = new LogEntry(logger, Level.INFO, new Date(2015, 2, 30, 18, 53, 45), "My entry #5");
		entry6 = new LogEntry(logger, Level.DEBUG, new Date(2015, 2, 30, 18, 54, 13), "My entry #6");
		entry7 = new LogEntry(logger, Level.INFO, new Date(2015, 2, 30, 18, 53, 45), "My entry #7");
		entry8 = new LogEntry(logger, Level.DEBUG, new Date(2015, 2, 30, 18, 54, 13), "My entry #8");
		
		line = "INFO: My entry #1\n";
		line2 = "DEBUG: My entry #2\n";
		line3 = "INFO: My entry #3\n";
		line4 = "DEBUG: My entry #4\n";
		line5 = "INFO: My entry #5\n";
		line6 = "DEBUG: My entry #6\n";
		line7 = "INFO: My entry #7\n";
		line8 = "DEBUG: My entry #8\n";
	});
	
	describe("#constructor()", function() {
		it("constructor(dirPath, fileName)", function() {
			var writer = new RollingFileWriter(TMP_DIR, FILE_NAME);
			
			writer.pattern.must.be.eq(RollingFileWriter.DEFAULT_PATTERN);
			writer.dirPath.must.be.eq(TMP_DIR);
			writer.fileName.must.be.eq(FILE_NAME);
			writer.sync.must.be.eq(RollingFileWriter.DEFAULT_OPTIONS.sync);
			writer.batch.must.be.eq(RollingFileWriter.DEFAULT_OPTIONS.batch);
			writer.buffer.must.be.eq([]);
			writer.encoding.must.be.eq(RollingFileWriter.DEFAULT_OPTIONS.encoding);
			writer.mode.must.be.eq(RollingFileWriter.DEFAULT_OPTIONS.mode);
			writer.maxSize.must.be.eq(RollingFileWriter.DEFAULT_OPTIONS.maxSize);
			writer.maxArchives.must.be.eq(RollingFileWriter.DEFAULT_OPTIONS.maxArchives);
		});
		
		it("constructor(dirPath, fileName, opts)", function() {
			var writer = new RollingFileWriter(TMP_DIR, FILE_NAME, {sync: true, batch: 2, maxSize: 1024, maxArchives: 5});
			
			writer.pattern.must.be.eq(RollingFileWriter.DEFAULT_PATTERN);
			writer.dirPath.must.be.eq(TMP_DIR);
			writer.fileName.must.be.eq(FILE_NAME);
			writer.sync.must.be.eq(true);
			writer.batch.must.be.eq(2);
			writer.buffer.must.be.eq([]);
			writer.encoding.must.be.eq(RollingFileWriter.DEFAULT_OPTIONS.encoding);
			writer.mode.must.be.eq(RollingFileWriter.DEFAULT_OPTIONS.mode);
			writer.maxSize.must.be.eq(1024);
			writer.maxArchives.must.be.eq(5);
		});
		
		it("constructor(pattern, dirPath, fileName)", function() {
			var writer = new RollingFileWriter("%l: %m", TMP_DIR, FILE_NAME);
			
			writer.pattern.must.be.eq("%l: %m");
			writer.dirPath.must.be.eq(TMP_DIR);
			writer.fileName.must.be.eq(FILE_NAME);
			writer.sync.must.be.eq(RollingFileWriter.DEFAULT_OPTIONS.sync);
			writer.batch.must.be.eq(RollingFileWriter.DEFAULT_OPTIONS.batch);
			writer.buffer.must.be.eq([]);
			writer.encoding.must.be.eq(RollingFileWriter.DEFAULT_OPTIONS.encoding);
			writer.mode.must.be.eq(RollingFileWriter.DEFAULT_OPTIONS.mode);
			writer.maxSize.must.be.eq(RollingFileWriter.DEFAULT_OPTIONS.maxSize);
			writer.maxArchives.must.be.eq(RollingFileWriter.DEFAULT_OPTIONS.maxArchives);
		});
		
		it("constructor(pattern, dirPath, fileName, opts)", function() {
			var writer = new RollingFileWriter("%l: %m", TMP_DIR, FILE_NAME, {sync: true, batch: 2, maxSize: 1024, maxArchives: 5});
			
			writer.pattern.must.be.eq("%l: %m");
			writer.dirPath.must.be.eq(TMP_DIR);
			writer.fileName.must.be.eq(FILE_NAME);
			writer.sync.must.be.eq(true);
			writer.batch.must.be.eq(2);
			writer.buffer.must.be.eq([]);
			writer.encoding.must.be.eq(RollingFileWriter.DEFAULT_OPTIONS.encoding);
			writer.mode.must.be.eq(RollingFileWriter.DEFAULT_OPTIONS.mode);
			writer.maxSize.must.be.eq(1024);
			writer.maxArchives.must.be.eq(5);
		});
		
		it("constructor(dirPath, fileName, opts) - Special situations", function() {
			var writer = new RollingFileWriter(TMP_DIR, FILE_NAME, {maxSize: -1024, maxArchives: -5});
			
			writer.pattern.must.be.eq(RollingFileWriter.DEFAULT_PATTERN);
			writer.dirPath.must.be.eq(TMP_DIR);
			writer.fileName.must.be.eq(FILE_NAME);
			writer.sync.must.be.eq(RollingFileWriter.DEFAULT_OPTIONS.sync);
			writer.encoding.must.be.eq(RollingFileWriter.DEFAULT_OPTIONS.encoding);
			writer.mode.must.be.eq(RollingFileWriter.DEFAULT_OPTIONS.mode);
			writer.maxSize.must.be.eq(RollingFileWriter.DEFAULT_OPTIONS.maxSize);
			writer.maxArchives.must.be.eq(RollingFileWriter.DEFAULT_OPTIONS.maxArchives);
		});
	});
	
	describe("#buildArchiveName()", function() {
		var writer;
		
		beforeEach(function() {
			writer = new RollingFileWriter(TMP_DIR, FILE_NAME);
		});
		
		it("buildArchiveName(1)", function() {
			writer.buildArchiveName(1).must.be.eq(ARCHIVE_NAME1);
		});
		
		it("buildArchiveName(2)", function() {
			writer.buildArchiveName(2).must.be.eq(ARCHIVE_NAME2);
		});
	});
	
	describe("#buildArchivePath()", function() {
		var writer;
		
		beforeEach(function() {
			writer = new RollingFileWriter(TMP_DIR, FILE_NAME);
		});
		
		it("buildArchivePath(1)", function() {
			writer.buildArchivePath(1).must.be.eq(path.join(TMP_DIR, ARCHIVE_NAME1));
		});
		
		it("buildArchivePath(2)", function() {
			writer.buildArchivePath(2).must.be.eq(path.join(TMP_DIR, ARCHIVE_NAME2));
		});
	});
	
	describe("#rollOverSync()", function() {
		var writer;
		
		beforeEach(function() {
			writer = new RollingFileWriter("%l: %m", TMP_DIR, FILE_NAME, {sync: true, maxArchives: 2});
		});
		
		afterEach(function() {
			if (fs.existsSync(writer.filePath)) fs.unlinkSync(writer.filePath);
			
			for (var i = 1; i < 5; ++i) {
				if (fs.existsSync(writer.buildArchivePath(i))) fs.unlinkSync(writer.buildArchivePath(i));
			}
		});
		
		it("rollOverSync() - once", function() {
			fs.writeFileSync(writer.filePath, line);
			writer.rollOverSync();
			
			fs.readFileSync(writer.filePath, {encoding: writer.encoding}).must.be.eq("");
			fs.readFileSync(writer.buildArchivePath(1), {encoding: writer.encoding}).must.be.eq(line);
			fs.existsSync(writer.buildArchivePath(2)).must.be.eq(false);
			fs.existsSync(writer.buildArchivePath(3)).must.be.eq(false);
		});
		
		it("rollOverSync() - twice", function() {
			fs.writeFileSync(writer.filePath, line);
			writer.rollOverSync();
			fs.writeFileSync(writer.filePath, line2);
			writer.rollOverSync();
			
			fs.readFileSync(writer.filePath, {encoding: writer.encoding}).must.be.eq("");
			fs.readFileSync(writer.buildArchivePath(1), {encoding: writer.encoding}).must.be.eq(line2);
			fs.readFileSync(writer.buildArchivePath(2), {encoding: writer.encoding}).must.be.eq(line);
			fs.existsSync(writer.buildArchivePath(3)).must.be.eq(false);
		});
		
		it("rollOverSync() - three times", function() {
			fs.writeFileSync(writer.filePath, line);
			writer.rollOverSync();
			fs.writeFileSync(writer.filePath, line2);
			writer.rollOverSync();
			fs.writeFileSync(writer.filePath, line3);
			writer.rollOverSync();
			
			fs.readFileSync(writer.filePath, {encoding: writer.encoding}).must.be.eq("");
			fs.readFileSync(writer.buildArchivePath(1), {encoding: writer.encoding}).must.be.eq(line3);
			fs.readFileSync(writer.buildArchivePath(2), {encoding: writer.encoding}).must.be.eq(line2);
			fs.existsSync(writer.buildArchivePath(3)).must.be.eq(false);
		});
	});
	
	describe("#writeSync()", function() {
		var writer;
		
		beforeEach(function() {
			writer = new RollingFileWriter("%l: %m", TMP_DIR, FILE_NAME, {sync: true, maxArchives: 2, maxSize: 20});
		});
		
		afterEach(function() {
			if (fs.existsSync(writer.filePath)) fs.unlinkSync(writer.filePath);
			
			for (var i = 1; i < 5; ++i) {
				if (fs.existsSync(writer.buildArchivePath(i))) fs.unlinkSync(writer.buildArchivePath(i));
			}
		});
	
		it("one write without rollover", function() {
			writer.write(entry);
			fs.readFileSync(writer.filePath, {encoding: writer.encoding}).must.be.eq(line);
			fs.existsSync(writer.buildArchivePath(1)).must.be.eq(false);
			fs.existsSync(writer.buildArchivePath(2)).must.be.eq(false);
			fs.existsSync(writer.buildArchivePath(3)).must.be.eq(false);
		});
	
		it("two writes without rollover", function() {
			writer.write(entry);
			writer.write(entry2);
			fs.readFileSync(writer.filePath, {encoding: writer.encoding}).must.be.equal(line + line2);
			fs.existsSync(writer.buildArchivePath(1)).must.be.eq(false);
			fs.existsSync(writer.buildArchivePath(2)).must.be.eq(false);
			fs.existsSync(writer.buildArchivePath(3)).must.be.eq(false);
		});
		
		it("three writes with one rollover", function() {
			writer.write(entry);
			writer.write(entry2);
			writer.write(entry3);
			
			fs.readFileSync(writer.filePath, {encoding: writer.encoding}).must.be.eq(line3);
			fs.readFileSync(writer.buildArchivePath(1), {encoding: writer.encoding}).must.be.eq(line + line2);
			fs.existsSync(writer.buildArchivePath(2)).must.be.eq(false);
			fs.existsSync(writer.buildArchivePath(3)).must.be.eq(false);
		});
		
		it("four writes with one rollover", function() {
			writer.write(entry);
			writer.write(entry2);
			writer.write(entry3);
			writer.write(entry4);
			
			fs.readFileSync(writer.filePath, {encoding: writer.encoding}).must.be.eq(line3 + line4);
			fs.readFileSync(writer.buildArchivePath(1), {encoding: writer.encoding}).must.be.eq(line + line2);
			fs.existsSync(writer.buildArchivePath(2)).must.be.eq(false);
			fs.existsSync(writer.buildArchivePath(3)).must.be.eq(false);
		});
		
		it("five writes with two rollovers", function() {
			writer.write(entry);
			writer.write(entry2);
			writer.write(entry3);
			writer.write(entry4);
			writer.write(entry5);
			
			fs.readFileSync(writer.filePath, {encoding: writer.encoding}).must.be.eq(line5);
			fs.readFileSync(writer.buildArchivePath(1), {encoding: writer.encoding}).must.be.eq(line3 + line4);
			fs.readFileSync(writer.buildArchivePath(2), {encoding: writer.encoding}).must.be.eq(line + line2);
			fs.existsSync(writer.buildArchivePath(3)).must.be.eq(false);
		});
		
		it("six writes with two rollovers", function() {
			writer.write(entry);
			writer.write(entry2);
			writer.write(entry3);
			writer.write(entry4);
			writer.write(entry5);
			writer.write(entry6);
			
			fs.readFileSync(writer.filePath, {encoding: writer.encoding}).must.be.eq(line5 + line6);
			fs.readFileSync(writer.buildArchivePath(1), {encoding: writer.encoding}).must.be.eq(line3 + line4);
			fs.readFileSync(writer.buildArchivePath(2), {encoding: writer.encoding}).must.be.eq(line + line2);
			fs.existsSync(writer.buildArchivePath(3)).must.be.eq(false);
		});
		
		it("seven writes with three rollovers", function() {
			writer.write(entry);
			writer.write(entry2);
			writer.write(entry3);
			writer.write(entry4);
			writer.write(entry5);
			writer.write(entry6);
			writer.write(entry7);
			
			fs.readFileSync(writer.filePath, {encoding: writer.encoding}).must.be.eq(line7);
			fs.readFileSync(writer.buildArchivePath(1), {encoding: writer.encoding}).must.be.eq(line5 + line6);
			fs.readFileSync(writer.buildArchivePath(2), {encoding: writer.encoding}).must.be.eq(line3 + line4);
			fs.existsSync(writer.buildArchivePath(3)).must.be.eq(false);
		});
		
		it("eight writes with three rollovers", function() {
			writer.write(entry);
			writer.write(entry2);
			writer.write(entry3);
			writer.write(entry4);
			writer.write(entry5);
			writer.write(entry6);
			writer.write(entry7);
			writer.write(entry8);
			
			fs.readFileSync(writer.filePath, {encoding: writer.encoding}).must.be.eq(line7 + line8);
			fs.readFileSync(writer.buildArchivePath(1), {encoding: writer.encoding}).must.be.eq(line5 + line6);
			fs.readFileSync(writer.buildArchivePath(2), {encoding: writer.encoding}).must.be.eq(line3 + line4);
			fs.existsSync(writer.buildArchivePath(3)).must.be.eq(false);
		});
	});
	
//	describe("#writeAsync()", function() {
//		var writer;
//		
//		beforeEach(function() {
//			writer = new RollingFileWriter("%l: %m", TMP_DIR, FILE_NAME, {maxArchives: 2, maxSize: 20});
//		});
//		
//		afterEach(function() {
//			if (fs.existsSync(writer.filePath)) fs.unlinkSync(writer.filePath);
//			
//			for (var i = 1; i < 5; ++i) {
//				var arch = writer.buildArchivePath(i);
//				if (fs.existsSync(arch)) fs.unlinkSync(arch);
//			}
//		});
//	
//		it("one write without rollover", function(done) {
//			writer.write(entry);
//			
//			setTimeout(function() {
//				fs.readFileSync(writer.filePath, {encoding: writer.encoding}).must.be.eq(line);
//				fs.existsSync(writer.buildArchivePath(1)).must.be.eq(false);
//				fs.existsSync(writer.buildArchivePath(2)).must.be.eq(false);
//				fs.existsSync(writer.buildArchivePath(3)).must.be.eq(false);
//				done();
//			}, SLEEP);
//		});
//	
//		it("two writes without rollover", function(done) {
//			writer.write(entry);
//			writer.write(entry2);
//			
//			setTimeout(function() {
//				var con;
//				
//				con = fs.readFileSync(writer.filePath, {encoding: writer.encoding});
//				con.must.contain(line);
//				con.must.contain(line2);
//				fs.existsSync(writer.buildArchivePath(1)).must.be.eq(false);
//				fs.existsSync(writer.buildArchivePath(2)).must.be.eq(false);
//				fs.existsSync(writer.buildArchivePath(3)).must.be.eq(false);
//				done();
//			}, SLEEP);
//		});
//		
//		it("three writes with one rollover", function(done) {
//			async.series({
//				one: function(done) {
//					writer.write(entry);
//					writer.write(entry2);
//					done();
//				},
//				
//				two: function(done) {
//					setTimeout(function() {
//						writer.write(entry3);
//						done();
//					}, SLEEP);
//				},
//				
//				wait: function(done) {
//					setTimeout(done, SLEEP);
//				}
//			}, function() {
//				var con;
//				
//				fs.readFileSync(writer.filePath, {encoding: writer.encoding}).must.be.eq(line3);
//				con = fs.readFileSync(writer.buildArchivePath(1), {encoding: writer.encoding});
//				con.must.contain(line);
//				con.must.contain(line2);
//				fs.existsSync(writer.buildArchivePath(2)).must.be.eq(false);
//				fs.existsSync(writer.buildArchivePath(3)).must.be.eq(false);
//				done();
//			});
//		});
//		
//		it("four writes with one rollover", function(done) {
//			async.series({
//				one: function(done) {
//					writer.write(entry);
//					writer.write(entry2);
//					done();
//				},
//				
//				two: function(done) {
//					setTimeout(function() {
//						writer.write(entry3);
//						writer.write(entry4);
//						done();
//					}, SLEEP);
//				},
//				
//				wait: function(done) {
//					setTimeout(done, SLEEP);
//				}
//			}, function() {
//				var con;
//				
//				con = fs.readFileSync(writer.filePath, {encoding: writer.encoding});
//				console.log(con);
//				con += fs.readFileSync(writer.buildArchivePath(1), {encoding: writer.encoding});
//				con.must.contain(line);
//				con.must.contain(line2);
//				con.must.contain(line3);
//				con.must.contain(line4);
//				
//				fs.existsSync(writer.buildArchivePath(2)).must.be.eq(false);
//				fs.existsSync(writer.buildArchivePath(3)).must.be.eq(false);
//				done();
//			});
//		});
//		
//		it("five writes with two rollovers", function(done) {
//			async.series({
//			  one: function(done) {
//			  	writer.write(entry);
//			  	writer.write(entry2);
//			  	done();
//			  },
//			  
//			  two: function(done) {
//			  	setTimeout(function() {
//			  		writer.write(entry3);
//			  		writer.write(entry4);
//			  		done();
//			  	}, SLEEP);
//			  },
//			  
//			  three: function(done) {
//			  	setTimeout(function() {
//			  		writer.write(entry5);
//			  		done();
//			  	}, SLEEP);
//			  },
//			  
//			  wait: function(done) {
//			  	setTimeout(done, SLEEP);
//			  }
//			}, function() {
//				var con;
//				
//				con = fs.readFileSync(writer.filePath, {encoding: writer.encoding});
//				con += fs.readFileSync(writer.buildArchivePath(1), {encoding: writer.encoding});
//				con += fs.readFileSync(writer.buildArchivePath(2), {encoding: writer.encoding});
//				
//				con.must.contain(line);
//				con.must.contain(line2);
//				con.must.contain(line3);
//				con.must.contain(line4);
//				con.must.contain(line5);
//				
//				fs.existsSync(writer.buildArchivePath(3)).must.be.eq(false);
//				done();
//			});
//		});
//		
//		it("six writes with two rollovers", function(done) {
//			async.series({
//				one: function(done) {
//					writer.write(entry);
//					writer.write(entry2);
//					done();
//				},
//				
//				two: function(done) {
//					setTimeout(function() {
//						writer.write(entry3);
//						writer.write(entry4);
//						done();
//					}, SLEEP);
//				},
//				
//				three: function(done) {
//					setTimeout(function() {
//						writer.write(entry5);
//						writer.write(entry6);
//						done();
//					}, SLEEP);
//				},
//				
//				wait: function(done) {
//					setTimeout(done, SLEEP);
//				}
//			}, function() {
//				var con;
//				
//				con = fs.readFileSync(writer.filePath, {encoding: writer.encoding});
//				con.must.contain(line5);
//				con.must.contain(line6);
//				
//				con = fs.readFileSync(writer.buildArchivePath(1), {encoding: writer.encoding});
//				con.must.contain(line3);
//				con.must.contain(line4);
//				
//				con = fs.readFileSync(writer.buildArchivePath(2), {encoding: writer.encoding});
//				con.must.contain(line);
//				con.must.contain(line2);
//				
//				fs.existsSync(writer.buildArchivePath(3)).must.be.eq(false);
//				done();
//			});
//		});
//		
//		it.skip("seven writes with three rollovers", function() {
//			writer.write(entry);
//			writer.write(entry2);
//			writer.write(entry3);
//			writer.write(entry4);
//			writer.write(entry5);
//			writer.write(entry6);
//			writer.write(entry7);
//			
//			fs.readFileSync(writer.filePath, {encoding: writer.encoding}).must.be.eq(line7);
//			fs.readFileSync(writer.buildArchivePath(1), {encoding: writer.encoding}).must.be.eq(line5 + line6);
//			fs.readFileSync(writer.buildArchivePath(2), {encoding: writer.encoding}).must.be.eq(line3 + line4);
//			fs.existsSync(writer.buildArchivePath(3)).must.be.eq(false);
//		});
//		
//		it.skip("eight writes with three rollovers", function() {
//			writer.write(entry);
//			writer.write(entry2);
//			writer.write(entry3);
//			writer.write(entry4);
//			writer.write(entry5);
//			writer.write(entry6);
//			writer.write(entry7);
//			writer.write(entry8);
//			
//			fs.readFileSync(writer.filePath, {encoding: writer.encoding}).must.be.eq(line7 + line8);
//			fs.readFileSync(writer.buildArchivePath(1), {encoding: writer.encoding}).must.be.eq(line5 + line6);
//			fs.readFileSync(writer.buildArchivePath(2), {encoding: writer.encoding}).must.be.eq(line3 + line4);
//			fs.existsSync(writer.buildArchivePath(3)).must.be.eq(false);
//		});
//	});
});