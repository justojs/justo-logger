//imports
const os = require("os");
const fs = require("fs");
const vlog = require("vit-logger");
const FileWriter = vlog.FileWriter;
const LogEntry = vlog.LogEntry;
const Level = vlog.Level;

//suite
describe("FileWriter", function() {
	const TMP_DIR = os.tmpdir();
	const FILE_NAME = "test.log";
	var logger, entry, entry2;
	
	beforeEach(function() {
		logger = {name: "app", qn: "app"};
		entry = new LogEntry(logger, Level.INFO, new Date(2015, 2, 30, 18, 53, 45), "My info message");
		entry2 = new LogEntry(logger, Level.DEBUG, new Date(2015, 2, 30, 18, 54, 13), "My debug message");
	});

	describe("#constructor()", function() {
		it("constructor(dirPath, fileName)", function() {
			var writer = new FileWriter(TMP_DIR, FILE_NAME);
			
			writer.pattern.must.be.equal(FileWriter.DEFAULT_PATTERN);
			writer.dirPath.must.be.equal(TMP_DIR);
			writer.fileName.must.be.equal(FILE_NAME);
			writer.sync.must.be.equal(FileWriter.DEFAULT_OPTIONS.sync);
			writer.encoding.must.be.equal(FileWriter.DEFAULT_OPTIONS.encoding);
			writer.mode.must.be.equal(FileWriter.DEFAULT_OPTIONS.mode);
		});
		
		it("constructor(dirPath, fileName, opts)", function() {
			var writer = new FileWriter(TMP_DIR, FILE_NAME, {sync: true});
			
			writer.pattern.must.be.equal(FileWriter.DEFAULT_PATTERN);
			writer.dirPath.must.be.equal(TMP_DIR);
			writer.fileName.must.be.equal(FILE_NAME);
			writer.sync.must.be.equal(true);
			writer.encoding.must.be.equal(FileWriter.DEFAULT_OPTIONS.encoding);
			writer.mode.must.be.equal(FileWriter.DEFAULT_OPTIONS.mode);
		});
		
		it("constructor(pattern, dirPath, fileName)", function() {
			var writer = new FileWriter("%l: %m", TMP_DIR, FILE_NAME);
			
			writer.pattern.must.be.equal("%l: %m");
			writer.dirPath.must.be.equal(TMP_DIR);
			writer.fileName.must.be.equal(FILE_NAME);
			writer.sync.must.be.equal(FileWriter.DEFAULT_OPTIONS.sync);
			writer.encoding.must.be.equal(FileWriter.DEFAULT_OPTIONS.encoding);
			writer.mode.must.be.equal(FileWriter.DEFAULT_OPTIONS.mode);
		});
		
		it("constructor(pattern, dirPath, fileName, opts)", function() {
			var writer = new FileWriter("%l: %m", TMP_DIR, FILE_NAME, {sync: true});
			
			writer.pattern.must.be.equal("%l: %m");
			writer.dirPath.must.be.equal(TMP_DIR);
			writer.fileName.must.be.equal(FILE_NAME);
			writer.sync.must.be.equal(true);
			writer.encoding.must.be.equal(FileWriter.DEFAULT_OPTIONS.encoding);
			writer.mode.must.be.equal(FileWriter.DEFAULT_OPTIONS.mode);
		});
	});
	
	describe("#write()", function() {
		var writer;
		
		afterEach(function() {
			fs.unlinkSync(writer.filePath);
		});
		
		describe("Synchronous writer", function() {
			beforeEach(function() {
				writer = new FileWriter("%l: %m", TMP_DIR, FILE_NAME, {sync: true});
			});
		
			it("one entry", function() {
				writer.write(entry);
				fs.readFileSync(writer.filePath, {encoding: writer.encoding}).must.be.equal("INFO: My info message\n");
			});
		
			it("two entries", function() {
				writer.write(entry);
				writer.write(entry2);
				fs.readFileSync(writer.filePath, {encoding: writer.encoding}).must.be.equal("INFO: My info message\nDEBUG: My debug message\n");
			});
		});
		
		describe("Asynchronous writer", function() {
			beforeEach(function() {
				writer = new FileWriter("%l: %m", TMP_DIR, FILE_NAME, {sync: false});
			});
			
			it("one entry", function(done) {
				writer.write(entry);
				
				setTimeout(function() {
					fs.readFileSync(writer.filePath, {encoding: writer.encoding}).must.be.equal("INFO: My info message\n");
					done();
				}, 1000);
			});
			
			it("two entries", function(done) {
				writer.write(entry);
				writer.write(entry2);
				
				setTimeout(function() {
					var content = fs.readFileSync(writer.filePath, {encoding: writer.encoding});
					(content.indexOf("INFO: My info message\n") >= 0).must.be.equal(true);
					(content.indexOf("DEBUG: My debug message\n") >= 0).must.be.equal(true);
					done();
				}, 1000);
			});
		});
	});
});