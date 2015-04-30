//imports
const assert = require("assert");
const dummy = require("justo-double").dummy;
const spy = require("justo-double").spy;
const vlog = require("../../../dist/es5/nodejs/vit-logger");
const Logger = vlog.Logger;
const Level = vlog.Level;

//suite
describe("Logger", function() {
  function DummyWriter() {

  }

  DummyWriter.prototype.write = function() {

  };

  describe("Root logger", function() {
    describe("#constructor", function() {
      describe("Error handling", function() {
        it("new Logger()", function() {
          (function() {
            var logger = new Logger();
          }).must.raise("The logger must have a name.");
        });
      });

      it("new Logger(name)", function() {
        var logger = new Logger("test");

        assert(logger.parent === undefined);
        logger.name.must.be.equal("test");
        logger.qn.must.be.equal("test");
        logger.minLevel.must.be.equal(Level.INFO);
        logger.maxLevel.must.be.equal(Level.FATAL);
      });

      it("new Logger(name, config)", function() {
        var logger = new Logger("test", {minLevel: Level.DEBUG, maxLevel: Level.INFO});

        assert(logger.parent === undefined);
        logger.name.must.be.equal("test");
        logger.qn.must.be.equal("test");
        logger.minLevel.must.be.equal(Level.DEBUG);
        logger.maxLevel.must.be.equal(Level.INFO);
      });

      it("new Logger(name, config) with min/maxLevel as strings", function() {
        var logger = new Logger("test", {minLevel: "debug", maxLevel: "info"});

        assert(logger.parent === undefined);
        logger.name.must.be.equal("test");
        logger.qn.must.be.equal("test");
        logger.minLevel.must.be.same(Level.DEBUG);
        logger.maxLevel.must.be.same(Level.INFO);
      });
    });
  });

  describe("Child logger", function() {
    var one;

    beforeEach(function() {
      one = new Logger("one");
    });

    describe("#constructor", function() {
      describe("Error handling", function() {
        it("new Logger(parent)", function() {
          (function() {
            var logger = new Logger(one);
          }).must.raise("The logger must have a name.");
        });
      });

      it("new Logger(parent, name)", function() {
        var logger = new Logger(one, "two");

        logger.parent.must.be.same(one);
        logger.name.must.be.equal("two");
        logger.qn.must.be.equal("one.two");
        logger.minLevel.must.be.equal(Level.INFO);
        logger.maxLevel.must.be.equal(Level.FATAL);
      });

      it("new Logger(parent, name, config)", function() {
        var logger = new Logger(one, "two", {minLevel: Level.DEBUG, maxLevel: Level.ERROR});

        logger.parent.must.be.same(one);
        logger.name.must.be.equal("two");
        logger.qn.must.be.equal("one.two");
        logger.minLevel.must.be.equal(Level.DEBUG);
        logger.maxLevel.must.be.equal(Level.ERROR);
      });
    });
  });

  describe("Dynamic reconfiguration", function() {
    var logger;

    beforeEach(function() {
      logger = new Logger("app");
    });

    describe("#minLevel", function() {
      it("set minLevel from Level", function() {
        logger.minLevel = Level.DEBUG;
        logger.minLevel.must.be.same(Level.DEBUG);
      });

      it("set minLevel from string", function() {
        logger.minLevel = "debug";
        logger.minLevel.must.be.same(Level.DEBUG);
      });
    });

    describe("#maxLevel", function() {
      it("set maxLevel from Level", function() {
        logger.maxLevel = Level.ERROR;
        logger.maxLevel.must.be.same(Level.ERROR);
      });

      it("set maxLevel from string", function() {
        logger.maxLevel = "error";
        logger.maxLevel.must.be.same(Level.ERROR);
      });
    });
  });

  describe("#onWrite()", function() {
    var logger;

    beforeEach(function() {
      logger = new Logger("one");
    });

    describe("Error handling", function() {
      it("onWrite()", function() {
        logger.onWrite.must.raise("Listener expected.");
      });
    });

    it("onWrite(writer : function)", function() {
      logger.onWrite(function() {});
      logger.writers.length.must.be.equal(1);
    });
  });

  describe("Log messages", function() {
    var logger, writer;

    describe("#format()", function() {
      beforeEach(function() {
        logger = new Logger("one");
      });

      it("format()", function() {
        logger.format().must.be.eq("");
      });

      it("format(msg)", function() {
        logger.format("My message").must.be.eq("My message");
      });

      it("format(pattern, param1, param2...)", function() {
        logger.format("Hi, %s, %s", "VIT", "how are you?").must.be.eq("Hi, VIT, how are you?");
      });
    });

    describe("#debug()", function() {
      describe("minLevel >= DEBUG", function() {
        beforeEach(function() {
          logger = new Logger("one", {minLevel: Level.DEBUG});
        });

        describe("Error handling", function() {
          it("debug()", function() {
            logger.debug.bind(logger).must.raise("Message expected.");
          });
        });

        describe("No writer", function() {
          it("debug(msg)", function() {
            logger.debug("My message.");
          });
        });

        describe("With writer", function() {
          beforeEach(function() {
            writer = spy(new DummyWriter(), "write()");
            logger.onWrite(writer);
          });

          it("debug(msg)", function() {
            logger.debug("My message.");
            writer.spy.called("write()").must.be.equal(1);
          });
        });
      });

      describe("minLevel > DEBUG", function() {
        beforeEach(function() {
          logger = new Logger("one", {minLevel: Level.INFO});
        });

        describe("Error handling", function() {
          it("debug()", function() {
            logger.debug.bind(logger).must.raise("Message expected.");
          });
        });

        describe("No writer", function() {
          it("debug(msg)", function() {
            logger.debug("My message.");
          });
        });

        describe("With writer", function() {
          beforeEach(function() {
            writer = spy(new DummyWriter(), "write()");
            logger.onWrite(writer);
          });

          it("debug(msg)", function() {
            logger.debug("My message.");
            writer.spy.called("write()").must.be.equal(0);
          });
        });
      });
    });

    describe("#info()", function() {
      describe("minLevel >= INFO", function() {
        beforeEach(function() {
          logger = new Logger("one", {minLevel: Level.INFO});
        });

        describe("Error handling", function() {
          it("info()", function() {
            logger.info.bind(logger).must.raise("Message expected.");
          });
        });

        describe("No writer", function() {
          it("info(msg)", function() {
            logger.info("My message.");
          });
        });

        describe("With writer", function() {
          beforeEach(function() {
            writer = spy(new DummyWriter(), "write()");
            logger.onWrite(writer);
          });

          it("info(msg)", function() {
            logger.info("My message.");
            writer.spy.called("write()").must.be.equal(1);
          });
        });
      });

      describe("minLevel > INFO", function() {
        beforeEach(function() {
          logger = new Logger("one", {minLevel: Level.WARN});
        });

        describe("Error handling", function() {
          it("info()", function() {
            logger.info.bind(logger).must.raise("Message expected.");
          });
        });

        describe("No writer", function() {
          it("info(msg)", function() {
            logger.info("My message.");
          });
        });

        describe("With writer", function() {
          beforeEach(function() {
            writer = spy(new DummyWriter(), "write()");
            logger.onWrite(writer);
          });

          it("info(msg)", function() {
            logger.info("My message.");
            writer.spy.called("write()").must.be.equal(0);
          });
        });
      });
    });

    describe("#warn()", function() {
      describe("minLevel >= WARN", function() {
        beforeEach(function() {
          logger = new Logger("one", {minLevel: Level.WARN});
        });

        describe("Error handling", function() {
          it("warn()", function() {
            logger.warn.bind(logger).must.raise("Message expected.");
          });
        });

        describe("No writer", function() {
          it("warn(msg)", function() {
            logger.warn("My message.");
          });
        });

        describe("With writer", function() {
          beforeEach(function() {
            writer = spy(new DummyWriter(), "write()");
            logger.onWrite(writer);
          });

          it("warn(msg)", function() {
            logger.warn("My message.");
            writer.spy.called("write()").must.be.equal(1);
          });
        });
      });

      describe("minLevel > WARN", function() {
        beforeEach(function() {
          logger = new Logger("one", {minLevel: Level.ERROR});
        });

        describe("Error handling", function() {
          it("warn()", function() {
            logger.warn.bind(logger).must.raise("Message expected.");
          });
        });

        describe("No writer", function() {
          it("warn(msg)", function() {
            logger.warn("My message.");
          });
        });

        describe("With writer", function() {
          beforeEach(function() {
            writer = spy(new DummyWriter(), "write()");
            logger.onWrite(writer);
          });

          it("warn(msg)", function() {
            logger.warn("My message.");
            writer.spy.called("write()").must.be.equal(0);
          });
        });
      });
    });

    describe("#error()", function() {
      describe("minLevel >= ERROR", function() {
        beforeEach(function() {
          logger = new Logger("one", {minLevel: Level.ERROR});
        });

        describe("Error handling", function() {
          it("error()", function() {
            logger.error.bind(logger).must.raise("Message expected.");
          });
        });

        describe("No writer", function() {
          it("error(msg)", function() {
            logger.error("My message.");
          });
        });

        describe("With writer", function() {
          beforeEach(function() {
            writer = spy(new DummyWriter(), "write()");
            logger.onWrite(writer);
          });

          it("error(msg)", function() {
            logger.error("My message.");
            writer.spy.called("write()").must.be.equal(1);
          });
        });
      });

      describe("minLevel > ERROR", function() {
        beforeEach(function() {
          logger = new Logger("one", {minLevel: Level.FATAL});
        });

        describe("Error handling", function() {
          it("error()", function() {
            logger.error.bind(logger).must.raise("Message expected.");
          });
        });

        describe("No writer", function() {
          it("error(msg)", function() {
            logger.error("My message.");
          });
        });

        describe("With writer", function() {
          beforeEach(function() {
            writer = spy(new DummyWriter(), "write()");
            logger.onWrite(writer);
          });

          it("error(msg)", function() {
            logger.error("My message.");
            writer.spy.called("write()").must.be.equal(0);
          });
        });
      });
    });

    describe("#fatal()", function() {
      describe("minLevel >= FATAL", function() {
        beforeEach(function() {
          logger = new Logger("one", {minLevel: Level.FATAL});
        });

        describe("Error handling", function() {
          it("fatal()", function() {
            logger.fatal.bind(logger).must.raise("Message expected.");
          });
        });

        describe("No writer", function() {
          it("fatal(msg)", function() {
            logger.fatal("My message.");
          });
        });

        describe("With writer", function() {
          beforeEach(function() {
            writer = spy(new DummyWriter(), "write()");
            logger.onWrite(writer);
          });

          it("fatal(msg)", function() {
            logger.fatal("My message.");
            writer.spy.called("write()").must.be.equal(1);
          });
        });
      });
    });
  });
});
