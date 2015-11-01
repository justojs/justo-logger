//imports
const spy = require("justo-spy");
const log = require("../../../../dist/es5/nodejs/justo-logger");
const Writer = log.Writer;
const ColoredConsoleWriter = log.writer.ColoredConsoleWriter;
const Level = log.Level;
const LogEntry = require("../../../../dist/es5/nodejs/justo-logger/lib/LogEntry");

//suite
describe("writer.ColoredConsoleWriter", function() {
  const DEFAULT_PATTERNS = Writer.DEFAULT_PATTERNS;
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

      writer.patterns.must.be.eq(DEFAULT_PATTERNS);
      writer.theme.must.be.eq(DEFAULT_THEME);
      writer.console.must.be.same(console);
    });

    it("new ColoredConsoleWriter(pattern : string)", function() {
      var writer = new ColoredConsoleWriter("%l: %m");

      writer.patterns.must.be.eq({
        debug: "%l: %m",
        info: "%l: %m",
        warn: "%l: %m",
        error: "%l: %m",
        fatal: "%l: %m"
      });
      writer.theme.must.be.eq(DEFAULT_THEME);
      writer.console.must.be.same(console);
    });

    it("new ColoredConsoleWriter(patterns : object)", function() {
      var writer = new ColoredConsoleWriter({
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
      writer.theme.must.be.eq(DEFAULT_THEME);
      writer.console.must.be.same(console);
    });

    it("new ColoredConsoleWriter(pattern : string, theme)", function() {
      var writer = new ColoredConsoleWriter("%m", {debug: "cyan"});

      writer.patterns.must.be.eq({
        debug: "%m",
        info: "%m",
        warn: "%m",
        error: "%m",
        fatal: "%m"
      });
      writer.theme.must.be.eq({
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

      writer.patterns.must.be.eq({
        debug: "%l: %m",
        info: "%l: %m",
        warn: "%l: %m",
        error: "%l: %m",
        fatal: "%l: %m"
      });
      writer.theme.must.be.eq({
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

      writer.patterns.must.be.eq({
        debug: "%l: %m",
        info: "%l: %m",
        warn: "%l: %m",
        error: "%l: %m",
        fatal: "%l: %m"
      });
      writer.theme.must.be.eq({
        debug: DEFAULT_THEME.debug,
        info: DEFAULT_THEME.info,
        warn: DEFAULT_THEME.warn,
        error: "yellow",
        fatal: DEFAULT_THEME.fatal
      });
      writer.console.must.be.eq({log: "", error: ""});
    });
  });

  describe("#format()", function() {
    it("format(entry) - %l [%t]: %m", function() {
      var writer = new ColoredConsoleWriter("%l [%t]: %m");
      writer.format(entry).must.match(/^.+INFO.+ \[2015-03-30 18:53:45\]: My message$/);
    });

    it("format(entry) - %l: %m", function() {
      var writer = new ColoredConsoleWriter("%l: %m");
      writer.format(entry).must.match(/^.+INFO.+: My message$/);
    });

    it("format(entry) - %l %s [%t]: %m", function() {
      var writer = new ColoredConsoleWriter("%l %s [%t]: %m");
      writer.format(entry).must.match(/^.+INFO.+ app \[2015-03-30 18:53:45\]: My message$/);
    });
  });

  describe("#write()", function() {
    var writer, console;

    beforeEach(function() {
      console = spy({}, ["log() {}", "error() {}"]);
      writer = new ColoredConsoleWriter(undefined, undefined, console);
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
      console.log.spy.called().must.be.eq(1);
      console.error.spy.called().must.be.eq(0);
    });

    it("write(ERROR)", function() {
      writer.write(errorEntry);
      console.log.spy.called().must.be.eq(1);
      console.error.spy.called().must.be.eq(0);
    });

    it("write(FATAL)", function() {
      writer.write(fatalEntry);
      console.log.spy.called().must.be.eq(1);
      console.error.spy.called().must.be.eq(0);
    });
  });
});
