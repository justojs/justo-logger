//imports
const spy = require("justo-spy");
const log = require("../../../dist/es5/nodejs/justo-logger");
const Logger = log.Logger;
const Level = log.Level;

//suite
describe.only("Logger", function() {
  const DEFAULT_OPTIONS = Logger.DEFAULT_OPTIONS;

  describe("#constructor()", function() {
    it("constructor()", function() {
      var logger = new Logger();
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
      var logger = new Logger("default");
      logger.must.have({
        name: "default",
        enabled: DEFAULT_OPTIONS.enabled,
        disabled: !DEFAULT_OPTIONS.enabled,
        minLevel: DEFAULT_OPTIONS.minLevel,
        maxLevel: DEFAULT_OPTIONS.maxLevel,
        patterns: DEFAULT_OPTIONS.patterns
      });
    });

    it("constructor(opts) - with opts.pattern", function() {
      var logger = new Logger({
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

    it("constructor(opts) - with opts.patterns", function() {
      var logger = new Logger({
        enabled: false,
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

    it("constructor(opts) - with opts.pattern and opts.patterns", function() {
      var logger = new Logger({
        enabled: false,
        minLevel: Level.DEBUG,
        maxLevel: Level.ERROR,
        pattern: "%l: %m",
        patterns: {
          info: "%m",
        }
      });

      logger.must.have({
        name: "logger",
        enabled: false,
        disabled: true,
        minLevel: Level.DEBUG,
        maxLevel: Level.ERROR,
        patterns: {
          debug: "%l: %m",
          info: "%m",
          warn: "%l: %m",
          error: "%l: %m",
          fatal: "%l: %m"
        }
      });
    });

    it("constructor(name, opts)", function() {
      var logger = new Logger("default", {enabled: false});
      logger.must.have({
        name: "default",
        enabled: false,
        disabled: true,
        minLevel: DEFAULT_OPTIONS.minLevel,
        maxLevel: DEFAULT_OPTIONS.maxLevel,
        patterns: DEFAULT_OPTIONS.patterns
      });
    });
  });

  describe("#debug()", function() {
    var logger;

    describe("Logger enabled", function() {
      beforeEach(function() {
        logger = spy(new Logger({minLevel: Level.DEBUG}), ["write() {}"]);
      });

      it("debug(msg)", function() {
        logger.debug("msg");
        logger.spy.called("write()").must.be.eq(1);
        logger.spy.getCall("write()", 0).arguments[0].must.have({
          level: Level.DEBUG,
          message: "msg"
        });
      });

      it("debug(...msg)", function() {
        logger.debug("p1", "p2", "p3");
        logger.spy.called("write()").must.be.eq(1);
        logger.spy.getCall("write()", 0).arguments[0].must.have({
          level: Level.DEBUG,
          message: "p1 p2 p3"
        });
      });
    });

    describe("Logger disabled", function() {
      beforeEach(function() {
        logger = spy(new Logger({enabled: false, minLevel: Level.DEBUG}), ["write() {}"]);
      });

      it("debug(msg)", function() {
        logger.debug("msg");
        logger.spy.called("write()").must.be.eq(0);
      });

      it("debug(...msg)", function() {
        logger.debug("p1", "p2", "p3");
        logger.spy.called("write()").must.be.eq(0);
      });
    });

    describe("< minimum level", function() {
      beforeEach(function() {
        logger = spy(new Logger({minLevel: Level.INFO}), ["write() {}"]);
      });

      it("debug(msg)", function() {
        logger.debug("msg");
        logger.spy.called("write()").must.be.eq(0);
      });
    });

    describe("= minimum level", function() {
      beforeEach(function() {
        logger = spy(new Logger({minLevel: Level.DEBUG}), ["write() {}"]);
      });

      it("debug(msg)", function() {
        logger.debug("msg");
        logger.spy.called("write()").must.be.eq(1);
      });
    });
  });

  describe("#info()", function() {
    var logger;

    describe("Logger enabled", function() {
      beforeEach(function() {
        logger = spy(new Logger({minLevel: Level.DEBUG}), ["write() {}"]);
      });

      it("info(msg)", function() {
        logger.info("msg");
        logger.spy.called("write()").must.be.eq(1);
        logger.spy.getCall("write()", 0).arguments[0].must.have({
          level: Level.INFO,
          message: "msg"
        });
      });

      it("info(...msg)", function() {
        logger.info("p1", "p2", "p3");
        logger.spy.called("write()").must.be.eq(1);
        logger.spy.getCall("write()", 0).arguments[0].must.have({
          level: Level.INFO,
          message: "p1 p2 p3"
        });
      });
    });

    describe("Logger disabled", function() {
      beforeEach(function() {
        logger = spy(new Logger({enabled: false, minLevel: Level.DEBUG}), ["write() {}"]);
      });

      it("info(msg)", function() {
        logger.info("msg");
        logger.spy.called("write()").must.be.eq(0);
      });

      it("info(...msg)", function() {
        logger.info("p1", "p2", "p3");
        logger.spy.called("write()").must.be.eq(0);
      });
    });

    describe("< minimum level", function() {
      beforeEach(function() {
        logger = spy(new Logger({minLevel: Level.WARN}), ["write() {}"]);
      });

      it("info(msg)", function() {
        logger.info("msg");
        logger.spy.called("write()").must.be.eq(0);
      });
    });

    describe("= minimum level", function() {
      beforeEach(function() {
        logger = spy(new Logger({minLevel: Level.INFO}), ["write() {}"]);
      });

      it("info(msg)", function() {
        logger.info("msg");
        logger.spy.called("write()").must.be.eq(1);
      });
    });

    describe("> minimum level", function() {
      beforeEach(function() {
        logger = spy(new Logger({minLevel: Level.DEBUG}), ["write() {}"]);
      });

      it("info(msg)", function() {
        logger.info("msg");
        logger.spy.called("write()").must.be.eq(1);
      });
    });
  });

  describe("#warn()", function() {
    var logger;

    describe("Logger enabled", function() {
      beforeEach(function() {
        logger = spy(new Logger({minLevel: Level.DEBUG}), ["write() {}"]);
      });

      it("warn(msg)", function() {
        logger.warn("msg");
        logger.spy.called("write()").must.be.eq(1);
        logger.spy.getCall("write()", 0).arguments[0].must.have({
          level: Level.WARN,
          message: "msg"
        });
      });

      it("warn(...msg)", function() {
        logger.warn("p1", "p2", "p3");
        logger.spy.called("write()").must.be.eq(1);
        logger.spy.getCall("write()", 0).arguments[0].must.have({
          level: Level.WARN,
          message: "p1 p2 p3"
        });
      });
    });

    describe("Logger disabled", function() {
      beforeEach(function() {
        logger = spy(new Logger({enabled: false, minLevel: Level.DEBUG}), ["write() {}"]);
      });

      it("warn(msg)", function() {
        logger.warn("msg");
        logger.spy.called("write()").must.be.eq(0);
      });

      it("warn(...msg)", function() {
        logger.warn("p1", "p2", "p3");
        logger.spy.called("write()").must.be.eq(0);
      });
    });

    describe("< minimum level", function() {
      beforeEach(function() {
        logger = spy(new Logger({minLevel: Level.ERROR}), ["write() {}"]);
      });

      it("warn(msg)", function() {
        logger.warn("msg");
        logger.spy.called("write()").must.be.eq(0);
      });
    });

    describe("= minimum level", function() {
      beforeEach(function() {
        logger = spy(new Logger({minLevel: Level.WARN}), ["write() {}"]);
      });

      it("warn(msg)", function() {
        logger.warn("msg");
        logger.spy.called("write()").must.be.eq(1);
      });
    });

    describe("> minimum level", function() {
      beforeEach(function() {
        logger = spy(new Logger({minLevel: Level.DEBUG}), ["write() {}"]);
      });

      it("warn(msg)", function() {
        logger.warn("msg");
        logger.spy.called("write()").must.be.eq(1);
      });
    });
  });

  describe("#error()", function() {
    var logger;

    describe("Logger enabled", function() {
      beforeEach(function() {
        logger = spy(new Logger({minLevel: Level.DEBUG}), ["write() {}"]);
      });

      it("error(msg)", function() {
        logger.error("msg");
        logger.spy.called("write()").must.be.eq(1);
        logger.spy.getCall("write()", 0).arguments[0].must.have({
          level: Level.ERROR,
          message: "msg"
        });
      });

      it("error(...msg)", function() {
        logger.error("p1", "p2", "p3");
        logger.spy.called("write()").must.be.eq(1);
        logger.spy.getCall("write()", 0).arguments[0].must.have({
          level: Level.ERROR,
          message: "p1 p2 p3"
        });
      });
    });

    describe("Logger disabled", function() {
      beforeEach(function() {
        logger = spy(new Logger({enabled: false, minLevel: Level.DEBUG}), ["write() {}"]);
      });

      it("error(msg)", function() {
        logger.error("msg");
        logger.spy.called("write()").must.be.eq(0);
      });

      it("error(...msg)", function() {
        logger.error("p1", "p2", "p3");
        logger.spy.called("write()").must.be.eq(0);
      });
    });

    describe("< minimum level", function() {
      beforeEach(function() {
        logger = spy(new Logger({minLevel: Level.FATAL}), ["write() {}"]);
      });

      it("error(msg)", function() {
        logger.error("msg");
        logger.spy.called("write()").must.be.eq(0);
      });
    });

    describe("= minimum level", function() {
      beforeEach(function() {
        logger = spy(new Logger({minLevel: Level.ERROR}), ["write() {}"]);
      });

      it("error(msg)", function() {
        logger.error("msg");
        logger.spy.called("write()").must.be.eq(1);
      });
    });

    describe("> minimum level", function() {
      beforeEach(function() {
        logger = spy(new Logger({minLevel: Level.DEBUG}), ["write() {}"]);
      });

      it("error(msg)", function() {
        logger.error("msg");
        logger.spy.called("write()").must.be.eq(1);
      });
    });
  });

  describe("#fatal()", function() {
    var logger;

    describe("Logger enabled", function() {
      beforeEach(function() {
        logger = spy(new Logger({minLevel: Level.DEBUG}), ["write() {}"]);
      });

      it("fatal(msg)", function() {
        logger.fatal("msg");
        logger.spy.called("write()").must.be.eq(1);
        logger.spy.getCall("write()", 0).arguments[0].must.have({
          level: Level.FATAL,
          message: "msg"
        });
      });

      it("fatal(...msg)", function() {
        logger.fatal("p1", "p2", "p3");
        logger.spy.called("write()").must.be.eq(1);
        logger.spy.getCall("write()", 0).arguments[0].must.have({
          level: Level.FATAL,
          message: "p1 p2 p3"
        });
      });
    });

    describe("Logger disabled", function() {
      beforeEach(function() {
        logger = spy(new Logger({enabled: false, minLevel: Level.DEBUG}), ["write() {}"]);
      });

      it("fatal(msg)", function() {
        logger.fatal("msg");
        logger.spy.called("write()").must.be.eq(0);
      });

      it("fatal(...msg)", function() {
        logger.fatal("p1", "p2", "p3");
        logger.spy.called("write()").must.be.eq(0);
      });
    });

    describe("= minimum level", function() {
      beforeEach(function() {
        logger = spy(new Logger({minLevel: Level.FATAL}), ["write() {}"]);
      });

      it("fatal(msg)", function() {
        logger.fatal("msg");
        logger.spy.called("write()").must.be.eq(1);
      });
    });

    describe("> minimum level", function() {
      beforeEach(function() {
        logger = spy(new Logger({minLevel: Level.DEBUG}), ["write() {}"]);
      });

      it("fatal(msg)", function() {
        logger.fatal("msg");
        logger.spy.called("write()").must.be.eq(1);
      });
    });
  });
});
