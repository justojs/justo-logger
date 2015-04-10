//imports
const sinon = require("sinon");
const vlog = require("vit-logger");
const Writer = vlog.Writer;
const ConsoleWriter = require("vit-logger").writer.ConsoleWriter;
const LogEntry = vlog.LogEntry;
const Level = vlog.Level;

//suite
describe("writer.ConsoleWriter", function() {
	var logger, entry, debugEntry, infoEntry, warnEntry, errorEntry, fatalEntry;
	
	beforeEach(function() {
		logger = {name: "app", qn: "app"};
		entry = new LogEntry(logger, Level.INFO, new Date(2015, 2, 30, 18, 53, 45), "My message");
		debugEntry = new LogEntry(logger, Level.DEBUG, new Date(2015, 2, 30, 18, 53, 45), "My message");
		infoEntry = entry;
		warnEntry = new LogEntry(logger, Level.WARN, new Date(2015, 2, 30, 18, 53, 45), "My message");
		errorEntry = new LogEntry(logger, Level.ERROR, new Date(2015, 2, 30, 18, 53, 45), "My message");
		fatalEntry = new LogEntry(logger, Level.FATAL, new Date(2015, 2, 30, 18, 53, 45), "My message");
	});
	
	describe("#constructor()", function() {
		it("constructor()", function() {
			var writer = new ConsoleWriter();
			
			writer.pattern.must.be.equal(Writer.DEFAULT_PATTERN);
			writer.console.must.be.same(console);
		});
		
		it("constructor(pattern)", function() {
			var writer = new ConsoleWriter("%l: %m");
			
			writer.pattern.must.be.equal("%l: %m");
			writer.console.must.be.same(console);
		});
		
		it("constructor(console)", function() {
			var writer = new ConsoleWriter({});
			
			writer.pattern.must.be.equal(Writer.DEFAULT_PATTERN);
			writer.console.must.be.equal({});
			writer.console.must.not.be.same(console);
		});
		
		it("constructor(pattern, console)", function() {
			var writer = new ConsoleWriter("%l: %m", {});
			
			writer.pattern.must.be.equal("%l: %m");
			writer.console.must.be.equal({});
			writer.console.must.not.be.same(console);
		});
	});
	
	describe("#write()", function() {
		var writer, console;
		
		beforeEach(function() {
			console = {};
			console.log = sinon.spy();
			console.error = sinon.spy();
			
			writer = new ConsoleWriter(console);
		});
		
		it("write(DEBUG)", function() {
			writer.write(debugEntry);
			console.log.callCount.must.be.equal(1);
			console.error.callCount.must.be.equal(0);
		});
		
		it("write(INFO)", function() {
			writer.write(infoEntry);
			console.log.callCount.must.be.equal(1);
			console.error.callCount.must.be.equal(0);
		});
		
		it("write(WARN)", function() {
			writer.write(warnEntry);
			console.log.callCount.must.be.equal(0);
			console.error.callCount.must.be.equal(1);
		});
		
		it("write(ERROR)", function() {
			writer.write(errorEntry);
			console.log.callCount.must.be.equal(0);
			console.error.callCount.must.be.equal(1);
		});
		
		it("write(FATAL)", function() {
			writer.write(fatalEntry);
			console.log.callCount.must.be.equal(0);
			console.error.callCount.must.be.equal(1);
		});
	});
});