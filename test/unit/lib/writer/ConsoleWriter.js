//imports
const spy = require("justo-spy");
const log = require("../../../../dist/es5/nodejs/justo-logger");
const Writer = log.Writer;
const ConsoleWriter = log.writer.ConsoleWriter;
const Level = log.Level;
const LogEntry = require("../../../../dist/es5/nodejs/justo-logger/lib/LogEntry");

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

      writer.patterns.must.be.eq(Writer.DEFAULT_PATTERNS);
      writer.console.must.be.same(console);
    });

    it("constructor(pattern : string)", function() {
      var writer = new ConsoleWriter("%l: %m");

      writer.patterns.must.be.eq({
        debug: "%l: %m",
        info: "%l: %m",
        warn: "%l: %m",
        error: "%l: %m",
        fatal: "%l: %m"
      });
      writer.console.must.be.same(console);
    });

    it("constructor(patterns : object)", function() {
      var writer = new ConsoleWriter({
        debug: "%m",
        info: "%m",
        warn: "%m",
        error: "%m",
        fatal: "%m"
      });
      writer.patterns.must.be.eq({
        debug: "%m",
        info: "%m",
        warn: "%m",
        error: "%m",
        fatal: "%m"
      });
      writer.console.must.be.same(console);
    });

    it("constructor(pattern : string, console)", function() {
      var writer = new ConsoleWriter("%m", console);
      writer.patterns.must.be.eq({
        debug: "%m",
        info: "%m",
        warn: "%m",
        error: "%m",
        fatal: "%m"
      });
      writer.console.must.be.same(console);
    });

    it("constructor(patterns : object, console)", function() {
      var console = {};
      var writer = new ConsoleWriter({
        debug: "%m",
        info: "%m",
        warn: "%m",
        error: "%m",
        fatal: "%m"
      }, console);

      writer.console.must.be.same(console);
      writer.patterns.must.be.eq({
        debug: "%m",
        info: "%m",
        warn: "%m",
        error: "%m",
        fatal: "%m"
      });
    });
  });

  describe("#write()", function() {
    var writer, console;

    beforeEach(function() {
      console = spy({}, ["log() {}", "error() {}"]);
      writer = new ConsoleWriter({}, console);
    });

    it("write(DEBUG)", function() {
      writer.write(debugEntry);
      console.log.spy.called().must.be.eq(1);
      console.error.spy.called().must.be.eq(0);
    });

    it("write(INFO)", function() {
      writer.write(infoEntry);
      console.log.spy.called().must.be.eq(1);
      console.error.spy.called().must.be.eq(0);
    });

    it("write(WARN)", function() {
      writer.write(warnEntry);
      console.log.spy.called().must.be.eq(0);
      console.error.spy.called().must.be.eq(1);
    });

    it("write(ERROR)", function() {
      writer.write(errorEntry);
      console.log.spy.called().must.be.eq(0);
      console.error.spy.called().must.be.eq(1);
    });

    it("write(FATAL)", function() {
      writer.write(fatalEntry);
      console.log.spy.called().must.be.eq(0);
      console.error.spy.called().must.be.eq(1);
    });
  });
});
