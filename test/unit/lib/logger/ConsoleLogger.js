//imports
const spy = require("justo-spy");
const log = require("../../../../dist/es5/nodejs/justo-logger");
const ConsoleLogger = log.logger.ConsoleLogger;
const Level = log.Level;
const LogEntry = log.LogEntry;

//suite
describe("ConsoleLogger", function() {
  const DEFAULT_OPTIONS = ConsoleLogger.DEFAULT_OPTIONS;

  describe("#constructor()", function() {
    it("constructor()", function() {
      var logger = new ConsoleLogger();
      logger.must.have({
        name: "logger",
        enabled: DEFAULT_OPTIONS.enabled,
        disabled: !DEFAULT_OPTIONS.enabled,
        minLevel: DEFAULT_OPTIONS.minLevel,
        maxLevel: DEFAULT_OPTIONS.maxLevel,
        patterns: DEFAULT_OPTIONS.patterns
      });
    });

    it("constructor(undefined)", function() {
      var logger = new ConsoleLogger(undefined);
      logger.must.have({
        name: "logger",
        enabled: DEFAULT_OPTIONS.enabled,
        disabled: !DEFAULT_OPTIONS.enabled,
        minLevel: DEFAULT_OPTIONS.minLevel,
        maxLevel: DEFAULT_OPTIONS.maxLevel,
        patterns: DEFAULT_OPTIONS.patterns
      });
    });

    it("constructor(null)", function() {
      var logger = new ConsoleLogger(null);
      logger.must.have({
        name: "logger",
        enabled: DEFAULT_OPTIONS.enabled,
        disabled: !DEFAULT_OPTIONS.enabled,
        minLevel: DEFAULT_OPTIONS.minLevel,
        maxLevel: DEFAULT_OPTIONS.maxLevel,
        patterns: DEFAULT_OPTIONS.patterns
      });
    });

    it("constructor(name)", function() {
      var logger = new ConsoleLogger("default");
      logger.must.have({
        name: "default",
        enabled: DEFAULT_OPTIONS.enabled,
        disabled: !DEFAULT_OPTIONS.enabled,
        minLevel: DEFAULT_OPTIONS.minLevel,
        maxLevel: DEFAULT_OPTIONS.maxLevel,
        patterns: DEFAULT_OPTIONS.patterns
      });
    });

    it("constructor(opts)", function() {
      var logger = new ConsoleLogger({
        enabled: false,
        minLevel: Level.DEBUG,
        maxLevel: Level.ERROR,
        pattern: "%m"
      });

      logger.must.have({
        name: "logger",
        enabled: false,
        disabled: true,
        minLevel: Level.DEBUG,
        maxLevel: Level.ERROR,
        patterns: {
          debug: "%m",
          info: "%m",
          warn: "%m",
          error: "%m",
          fatal: "%m"
        }
      });
    });
  });

  describe("#write()", function() {
    var logger;

    beforeEach(function() {
      logger = new ConsoleLogger();
      logger.console = spy({}, ["log() {}", "error() {}"]);
    });

    it("write(entry) - DEBUG", function() {
      logger.write(new LogEntry("test", Level.DEBUG, new Date(), "msg"));
      logger.console.spy.called("log()").must.be.eq(1);
      logger.console.spy.called("error()").must.be.eq(0);
    });

    it("write(entry) - INFO", function() {
      logger.write(new LogEntry("test", Level.INFO, new Date(), "msg"));
      logger.console.spy.called("log()").must.be.eq(1);
      logger.console.spy.called("error()").must.be.eq(0);
    });

    it("write(entry) - WARN", function() {
      logger.write(new LogEntry("test", Level.WARN, new Date(), "msg"));
      logger.console.spy.called("log()").must.be.eq(0);
      logger.console.spy.called("error()").must.be.eq(1);
    });

    it("write(entry) - ERROR", function() {
      logger.write(new LogEntry("test", Level.ERROR, new Date(), "msg"));
      logger.console.spy.called("log()").must.be.eq(0);
      logger.console.spy.called("error()").must.be.eq(1);
    });

    it("write(entry) - FATAL", function() {
      logger.write(new LogEntry("test", Level.FATAL, new Date(), "msg"));
      logger.console.spy.called("log()").must.be.eq(0);
      logger.console.spy.called("error()").must.be.eq(1);
    });
  });

  describe("#format()", function() {
    var logger, debug, info, warn, error, fatal;

    describe("All fields", function() {
      beforeEach(function() {
        logger = new ConsoleLogger({name: "test", pattern: "%t [%s] %l: %m"});
        debug = new LogEntry(logger, Level.DEBUG, new Date(), "The DEBUG message.");
        info = new LogEntry(logger, Level.INFO, new Date(), "The INFO message.");
        warn = new LogEntry(logger, Level.WARN, new Date(), "The WARN message.");
        error = new LogEntry(logger, Level.ERROR, new Date(), "The ERROR message.");
        fatal = new LogEntry(logger, Level.FATAL, new Date(), "The FATAL message.");
      });

      it("format(entry) - DEBUG", function() {
        logger.format(debug).must.match(/^.{4,4}-.{2,2}-.{2,2} .{2,2}:.{2,2}:.{2,2} \[test\] DEBUG: The DEBUG message\.$/);
      });

      it("format(entry) - INFO", function() {
        logger.format(info).must.match(/^.{4,4}-.{2,2}-.{2,2} .{2,2}:.{2,2}:.{2,2} \[test\] INFO: The INFO message\.$/);
      });

      it("format(entry) - WARN", function() {
        logger.format(warn).must.match(/^.{4,4}-.{2,2}-.{2,2} .{2,2}:.{2,2}:.{2,2} \[test\] WARN: The WARN message\.$/);
      });

      it("format(entry) - ERROR", function() {
        logger.format(error).must.match(/^.{4,4}-.{2,2}-.{2,2} .{2,2}:.{2,2}:.{2,2} \[test\] ERROR: The ERROR message\.$/);
      });

      it("format(entry) - FATAL", function() {
        logger.format(fatal).must.match(/^.{4,4}-.{2,2}-.{2,2} .{2,2}:.{2,2}:.{2,2} \[test\] FATAL: The FATAL message\.$/);
      });
    });

    describe("Only some fields", function() {
      beforeEach(function() {
        logger = new ConsoleLogger({name: "test", pattern: "%l: %m"});
        debug = new LogEntry(logger, Level.DEBUG, new Date(), "The DEBUG message.");
        info = new LogEntry(logger, Level.INFO, new Date(), "The INFO message.");
        warn = new LogEntry(logger, Level.WARN, new Date(), "The WARN message.");
        error = new LogEntry(logger, Level.ERROR, new Date(), "The ERROR message.");
        fatal = new LogEntry(logger, Level.FATAL, new Date(), "The FATAL message.");
      });

      it("format(entry) - DEBUG", function() {
        logger.format(debug).must.be.eq("DEBUG: The DEBUG message.");
      });

      it("format(entry) - INFO", function() {
        logger.format(info).must.be.eq("INFO: The INFO message.");
      });

      it("format(entry) - WARN", function() {
        logger.format(warn).must.be.eq("WARN: The WARN message.");
      });

      it("format(entry) - ERROR", function() {
        logger.format(error).must.be.eq("ERROR: The ERROR message.");
      });

      it("format(entry) - FATAL", function() {
        logger.format(fatal).must.be.eq("FATAL: The FATAL message.");
      });
    });
  });
});
