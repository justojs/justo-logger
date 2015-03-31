//imports
const sinon = require("sinon");
const vlog = require("vit-logger");
const Writer = vlog.Writer;
const ColoredConsoleWriter = vlog.ColoredConsoleWriter;
const LogEntry = vlog.LogEntry;
const Level = vlog.Level;

//suite
describe("ColoredConsoleWriter", function() {
	const DEFAULT_PATTERN = Writer.DEFAULT_PATTERN;
	const DEFAULT_THEME = ColoredConsoleWriter.DEFAULT_THEME;
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
		it("new ColoredConsoleWriter()", function() {
			var writer = new ColoredConsoleWriter();
			
			writer.pattern.must.be.equal(DEFAULT_PATTERN);
			writer.theme.must.be.equal(DEFAULT_THEME);
			writer.console.must.be.same(console);
		});
		
		it("new ColoredConsoleWriter(pattern)", function() {
			var writer = new ColoredConsoleWriter("%l: %m");
			
			writer.pattern.must.be.equal("%l: %m");
			writer.theme.must.be.equal(DEFAULT_THEME);
			writer.console.must.be.same(console);
		});
		
		it("new ColoredConsoleWriter(theme)", function() {
			var writer = new ColoredConsoleWriter({debug: "cyan"});
			
			writer.pattern.must.be.equal(DEFAULT_PATTERN);
			writer.theme.must.be.equal({
				debug: "cyan",
				info: DEFAULT_THEME.info,
				warn: DEFAULT_THEME.warn,
				error: DEFAULT_THEME.error,
				fatal: DEFAULT_THEME.fatal
			});
			writer.console.must.be.same(console);
		});
		
		it("new ColoredConsoleWriter(pattern, theme)", function() {
			var writer = new ColoredConsoleWriter("%l: %m", {info: "cyan"});
			
			writer.pattern.must.be.equal("%l: %m");
			writer.theme.must.be.equal({
				debug: DEFAULT_THEME.debug,
				info: "cyan",
				warn: DEFAULT_THEME.warn,
				error: DEFAULT_THEME.error,
				fatal: DEFAULT_THEME.fatal
			});
			writer.console.must.be.same(console);
		});
		
		it("new ColoredConsoleWriter(pattern, theme, console)", function() {
			var writer = new ColoredConsoleWriter("%l: %m", {error: "yellow"}, {log: "", error: ""});
			
			writer.pattern.must.be.equal("%l: %m");
			writer.theme.must.be.equal({
				debug: DEFAULT_THEME.debug,
				info: DEFAULT_THEME.info,
				warn: DEFAULT_THEME.warn,
				error: "yellow",
				fatal: DEFAULT_THEME.fatal
			});
			writer.console.must.be.equal({log: "", error: ""});
		});
	});
	
	describe("#format()", function() {
		it("format(entry) - %l [%t]: %m", function() {
			var writer = new ColoredConsoleWriter("%l [%t]: %m");
			writer.format(entry).must.be.equal("\u001b[37mINFO\u001b[39m [2015-03-30 18:53:45]: My message");
		});
		
		it("format(entry) - %l: %m", function() {
			var writer = new ColoredConsoleWriter("%l: %m");
			writer.format(entry).must.be.equal("\u001b[37mINFO\u001b[39m: My message");
		});
		
		it("format(entry) - %l %s [%t]: %m", function() {
			var writer = new ColoredConsoleWriter("%l %s [%t]: %m");
			writer.format(entry).must.be.equal("\u001b[37mINFO\u001b[39m app [2015-03-30 18:53:45]: My message");
		});
	});
	
	describe("#write()", function() {
		var writer, console;
		
		beforeEach(function() {
			console = {};
			console.log = sinon.spy();
			console.error = sinon.spy();
			
			writer = new ColoredConsoleWriter(undefined, undefined, console);
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
			console.log.callCount.must.be.equal(1);
			console.error.callCount.must.be.equal(0);
		});
		
		it("write(ERROR)", function() {
			writer.write(errorEntry);
			console.log.callCount.must.be.equal(1);
			console.error.callCount.must.be.equal(0);
		});
		
		it("write(FATAL)", function() {
			writer.write(fatalEntry);
			console.log.callCount.must.be.equal(1);
			console.error.callCount.must.be.equal(0);
		});
	});
});