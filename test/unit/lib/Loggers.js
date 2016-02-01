//imports
const spy = require("justo-spy");
const log = require("../../../dist/es5/nodejs/justo-logger");
const Loggers = log.Loggers;
const Level = log.Level;

//suite
describe("Loggers", function() {
  describe("#constructor()", function() {
    it("constructor()", function() {
      (new Loggers()).length.must.be.eq(0);
    });
  });

  describe("#add()", function() {
    var loggers;

    beforeEach(function() {
      loggers = new Loggers();
    });

    it("add() - one", function() {
      loggers.add({x: 1});
      loggers.items.must.be.eq([{x: 1}]);
    });

    it("add() - two", function() {
      loggers.add({x: 1});
      loggers.add({x: 2});
      loggers.items.must.be.eq([{x: 1}, {x: 2}]);
    });
  });

  describe("#debug()", function() {
    var loggers;

    beforeEach(function() {
      loggers = new Loggers();
    });

    it("#debug() - with one logger", function() {
      var logger = spy({}, "debug() {}");

      loggers.add(logger);
      loggers.debug("msg");

      logger.spy.called("debug").must.be.eq(1);
    });

    it("#debug() - with two loggers", function() {
      var logger1 = spy({}, "debug() {}");
      var logger2 = spy({}, "debug() {}");

      loggers.add(logger1);
      loggers.add(logger2);

      loggers.debug("msg");

      logger1.spy.called("debug()").must.be.eq(1);
      logger2.spy.called("debug()").must.be.eq(1);
    });
  });

  describe("#info()", function() {
    var loggers;

    beforeEach(function() {
      loggers = new Loggers();
    });

    it("#info() - with one logger", function() {
      var logger = spy({}, "info() {}");

      loggers.add(logger);
      loggers.info("msg");

      logger.spy.called("info").must.be.eq(1);
    });

    it("#info() - with two loggers", function() {
      var logger1 = spy({}, "info() {}");
      var logger2 = spy({}, "info() {}");

      loggers.add(logger1);
      loggers.add(logger2);

      loggers.info("msg");

      logger1.spy.called("info()").must.be.eq(1);
      logger2.spy.called("info()").must.be.eq(1);
    });
  });

  describe("#warn()", function() {
    var loggers;

    beforeEach(function() {
      loggers = new Loggers();
    });

    it("#warn() - with one logger", function() {
      var logger = spy({}, "warn() {}");

      loggers.add(logger);
      loggers.warn("msg");

      logger.spy.called("warn").must.be.eq(1);
    });

    it("#warn() - with two loggers", function() {
      var logger1 = spy({}, "warn() {}");
      var logger2 = spy({}, "warn() {}");

      loggers.add(logger1);
      loggers.add(logger2);

      loggers.warn("msg");

      logger1.spy.called("warn()").must.be.eq(1);
      logger2.spy.called("warn()").must.be.eq(1);
    });
  });

  describe("#error()", function() {
    var loggers;

    beforeEach(function() {
      loggers = new Loggers();
    });

    it("#error() - with one logger", function() {
      var logger = spy({}, "error() {}");

      loggers.add(logger);
      loggers.error("msg");

      logger.spy.called("error").must.be.eq(1);
    });

    it("#error() - with two loggers", function() {
      var logger1 = spy({}, "error() {}");
      var logger2 = spy({}, "error() {}");

      loggers.add(logger1);
      loggers.add(logger2);

      loggers.error("msg");

      logger1.spy.called("error()").must.be.eq(1);
      logger2.spy.called("error()").must.be.eq(1);
    });
  });

  describe("#fatal()", function() {
    var loggers;

    beforeEach(function() {
      loggers = new Loggers();
    });

    it("#fatal() - with one logger", function() {
      var logger = spy({}, "fatal() {}");

      loggers.add(logger);
      loggers.fatal("msg");

      logger.spy.called("fatal").must.be.eq(1);
    });

    it("#fatal() - with two loggers", function() {
      var logger1 = spy({}, "fatal() {}");
      var logger2 = spy({}, "fatal() {}");

      loggers.add(logger1);
      loggers.add(logger2);

      loggers.fatal("msg");

      logger1.spy.called("fatal()").must.be.eq(1);
      logger2.spy.called("fatal()").must.be.eq(1);
    });
  });
});
