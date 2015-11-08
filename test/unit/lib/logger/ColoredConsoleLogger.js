//imports
const spy = require("justo-spy");
const log = require("../../../../dist/es5/nodejs/justo-logger");
const ColoredConsoleLogger = log.logger.ColoredConsoleLogger;
const Level = log.Level;
const LogEntry = log.LogEntry;

//suite
describe("ColoredConsoleLogger", function() {
  const DEFAULT_OPTIONS = ColoredConsoleLogger.DEFAULT_OPTIONS;
  const DEFAULT_THEME = ColoredConsoleLogger.DEFAULT_THEME;

  describe("#constructor()", function() {
    it("constructor()", function() {
      var logger = new ColoredConsoleLogger();
      logger.must.have({
        name: "logger",
        enabled: DEFAULT_OPTIONS.enabled,
        disabled: !DEFAULT_OPTIONS.enabled,
        minLevel: DEFAULT_OPTIONS.minLevel,
        maxLevel: DEFAULT_OPTIONS.maxLevel,
        patterns: DEFAULT_OPTIONS.patterns,
        theme: DEFAULT_THEME
      });
    });

    it("constructor(undefined)", function() {
      var logger = new ColoredConsoleLogger(undefined);
      logger.must.have({
        name: "logger",
        enabled: DEFAULT_OPTIONS.enabled,
        disabled: !DEFAULT_OPTIONS.enabled,
        minLevel: DEFAULT_OPTIONS.minLevel,
        maxLevel: DEFAULT_OPTIONS.maxLevel,
        patterns: DEFAULT_OPTIONS.patterns,
        theme: DEFAULT_THEME
      });
    });

    it("constructor(null)", function() {
      var logger = new ColoredConsoleLogger(null);
      logger.must.have({
        name: "logger",
        enabled: DEFAULT_OPTIONS.enabled,
        disabled: !DEFAULT_OPTIONS.enabled,
        minLevel: DEFAULT_OPTIONS.minLevel,
        maxLevel: DEFAULT_OPTIONS.maxLevel,
        patterns: DEFAULT_OPTIONS.patterns,
        theme: DEFAULT_THEME
      });
    });

    it("constructor(name)", function() {
      var logger = new ColoredConsoleLogger("default");
      logger.must.have({
        name: "default",
        enabled: DEFAULT_OPTIONS.enabled,
        disabled: !DEFAULT_OPTIONS.enabled,
        minLevel: DEFAULT_OPTIONS.minLevel,
        maxLevel: DEFAULT_OPTIONS.maxLevel,
        patterns: DEFAULT_OPTIONS.patterns,
        theme: DEFAULT_THEME
      });
    });

    it("constructor(opts)", function() {
      var logger = new ColoredConsoleLogger({
        enabled: false,
        minLevel: Level.DEBUG,
        maxLevel: Level.ERROR,
        pattern: "%m",
        theme: {
          debug: "blue",
          info: "black",
          warn: "green",
          error: "white",
          fatal: "gray"
        }
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
        },
        theme: {
          debug: "blue",
          info: "black",
          warn: "green",
          error: "white",
          fatal: "gray"
        }
      });
    });
  });

  describe("#format()", function() {
    var logger, debug, info, warn, error, fatal;

    describe("All fields", function() {
      beforeEach(function() {
        logger = new ColoredConsoleLogger({name: "test", pattern: "%t [%s] %l: %m"});
        debug = new LogEntry(logger, Level.DEBUG, new Date(), "The DEBUG message.");
        info = new LogEntry(logger, Level.INFO, new Date(), "The INFO message.");
        warn = new LogEntry(logger, Level.WARN, new Date(), "The WARN message.");
        error = new LogEntry(logger, Level.ERROR, new Date(), "The ERROR message.");
        fatal = new LogEntry(logger, Level.FATAL, new Date(), "The FATAL message.");
      });

      it("format(entry) - DEBUG", function() {
        logger.format(debug).must.match(/^.{4,4}-.{2,2}-.{2,2} .{2,2}:.{2,2}:.{2,2} \[test\] .+DEBUG.+: The DEBUG message\.$/);
      });

      it("format(entry) - INFO", function() {
        logger.format(info).must.match(/^.{4,4}-.{2,2}-.{2,2} .{2,2}:.{2,2}:.{2,2} \[test\] .+INFO.+: The INFO message\.$/);
      });

      it("format(entry) - WARN", function() {
        logger.format(warn).must.match(/^.{4,4}-.{2,2}-.{2,2} .{2,2}:.{2,2}:.{2,2} \[test\] .+WARN.+: The WARN message\.$/);
      });

      it("format(entry) - ERROR", function() {
        logger.format(error).must.match(/^.{4,4}-.{2,2}-.{2,2} .{2,2}:.{2,2}:.{2,2} \[test\] .+ERROR.+: The ERROR message\.$/);
      });

      it("format(entry) - FATAL", function() {
        logger.format(fatal).must.match(/^.{4,4}-.{2,2}-.{2,2} .{2,2}:.{2,2}:.{2,2} \[test\] .+FATAL.+: The FATAL message\.$/);
      });
    });

    describe("Only some fields", function() {
      beforeEach(function() {
        logger = new ColoredConsoleLogger({name: "test", pattern: "%l: %m"});
        debug = new LogEntry(logger, Level.DEBUG, new Date(), "The DEBUG message.");
        info = new LogEntry(logger, Level.INFO, new Date(), "The INFO message.");
        warn = new LogEntry(logger, Level.WARN, new Date(), "The WARN message.");
        error = new LogEntry(logger, Level.ERROR, new Date(), "The ERROR message.");
        fatal = new LogEntry(logger, Level.FATAL, new Date(), "The FATAL message.");
      });

      it("format(entry) - DEBUG", function() {
        logger.format(debug).must.match(/^.+DEBUG.+: The DEBUG message\.$/);
      });

      it("format(entry) - INFO", function() {
        logger.format(info).must.match(/^.+INFO.+: The INFO message\.$/);
      });

      it("format(entry) - WARN", function() {
        logger.format(warn).must.match(/^.+WARN.+: The WARN message\.$/);
      });

      it("format(entry) - ERROR", function() {
        logger.format(error).must.match(/^.+ERROR.+: The ERROR message\.$/);
      });

      it("format(entry) - FATAL", function() {
        logger.format(fatal).must.match(/^.+FATAL.+: The FATAL message\.$/);
      });
    });
  });
});
