//imports
const assert = require("assert");
const sinon = require("sinon");
const log = require("vit-logger");
const Logger = log.Logger;

//suite
describe("Logger", function() {
	describe("Root logger", function() {
		describe("#constructor", function() {
			describe("Error handling", function() {
				it("new Logger()", function() {
					(function() {
						new Logger();
					}).must.raise("The logger must have a name.");
				});
			});
			
			it("new Logger(name)", function() {
				var logger = new Logger("test");
				
				assert(logger.parent === undefined);
				logger.name.must.be.equal("test");
				logger.qn.must.be.equal("test");
				logger.minLevel.must.be.equal(log.Level.INFO);
				logger.maxLevel.must.be.equal(log.Level.FATAL);
			});
			
			it("new Logger(name, config)", function() {
				var logger = new Logger("test", {minLevel: log.Level.DEBUG, maxLevel: log.Level.INFO});
				
				assert(logger.parent === undefined);
				logger.name.must.be.equal("test");
				logger.qn.must.be.equal("test");
				logger.minLevel.must.be.equal(log.Level.DEBUG);
				logger.maxLevel.must.be.equal(log.Level.INFO);
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
						new Logger(one);
					}).must.raise("The logger must have a name.");
				});
			});
			
			it("new Logger(parent, name)", function() {
				var logger = new Logger(one, "two");

				logger.parent.must.be.same(one);
				logger.name.must.be.equal("two");
				logger.qn.must.be.equal("one.two");
				logger.minLevel.must.be.equal(log.Level.INFO);
				logger.maxLevel.must.be.equal(log.Level.FATAL);
			});
			
			it("new Logger(parent, name, config)", function() {
				var logger = new Logger(one, "two", {minLevel: log.Level.DEBUG, maxLevel: log.Level.ERROR});
				
				logger.parent.must.be.same(one);
				logger.name.must.be.equal("two");
				logger.qn.must.be.equal("one.two");
				logger.minLevel.must.be.equal(log.Level.DEBUG);
				logger.maxLevel.must.be.equal(log.Level.ERROR);
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
		
		describe("#debug()", function() {
			describe("minLevel >= DEBUG", function() {
				beforeEach(function() {
					logger = new Logger("one", {minLevel: log.Level.DEBUG});
					writer = sinon.spy();
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
						logger.onWrite(writer);
					});
					
					it("debug(msg)", function() {
						logger.debug("My message.");
						writer.callCount.must.be.equal(1);
					});
				});
			});
		
			describe("minLevel > DEBUG", function() {
				beforeEach(function() {
					logger = new Logger("one", {minLevel: log.Level.INFO});
					writer = sinon.spy();
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
						logger.onWrite(writer);
					});
					
					it("debug(msg)", function() {
						logger.debug("My message.");
						writer.callCount.must.be.equal(0);
					});
				});
			});
		});
		
		describe("#info()", function() {
			describe("minLevel >= INFO", function() {
				beforeEach(function() {
					logger = new Logger("one", {minLevel: log.Level.INFO});
					writer = sinon.spy();
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
						logger.onWrite(writer);
					});
					
					it("info(msg)", function() {
						logger.info("My message.");
						writer.callCount.must.be.equal(1);
					});
				});
			});
		
			describe("minLevel > INFO", function() {
				beforeEach(function() {
					logger = new Logger("one", {minLevel: log.Level.WARN});
					writer = sinon.spy();
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
						logger.onWrite(writer);
					});
					
					it("info(msg)", function() {
						logger.info("My message.");
						writer.callCount.must.be.equal(0);
					});
				});
			});
		});
		
		describe("#warn()", function() {
			describe("minLevel >= WARN", function() {
				beforeEach(function() {
					logger = new Logger("one", {minLevel: log.Level.WARN});
					writer = sinon.spy();
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
						logger.onWrite(writer);
					});
					
					it("warn(msg)", function() {
						logger.warn("My message.");
						writer.callCount.must.be.equal(1);
					});
				});
			});
		
			describe("minLevel > WARN", function() {
				beforeEach(function() {
					logger = new Logger("one", {minLevel: log.Level.ERROR});
					writer = sinon.spy();
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
						logger.onWrite(writer);
					});
					
					it("warn(msg)", function() {
						logger.warn("My message.");
						writer.callCount.must.be.equal(0);
					});
				});
			});
		});
		
		describe("#error()", function() {
			describe("minLevel >= ERROR", function() {
				beforeEach(function() {
					logger = new Logger("one", {minLevel: log.Level.ERROR});
					writer = sinon.spy();
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
						logger.onWrite(writer);
					});
					
					it("error(msg)", function() {
						logger.error("My message.");
						writer.callCount.must.be.equal(1);
					});
				});
			});
		
			describe("minLevel > ERROR", function() {
				beforeEach(function() {
					logger = new Logger("one", {minLevel: log.Level.FATAL});
					writer = sinon.spy();
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
						logger.onWrite(writer);
					});
					
					it("error(msg)", function() {
						logger.error("My message.");
						writer.callCount.must.be.equal(0);
					});
				});
			});
		});
		
		describe("#fatal()", function() {
			describe("minLevel >= FATAL", function() {
				beforeEach(function() {
					logger = new Logger("one", {minLevel: log.Level.FATAL});
					writer = sinon.spy();
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
						logger.onWrite(writer);
					});
					
					it("fatal(msg)", function() {
						logger.fatal("My message.");
						writer.callCount.must.be.equal(1);
					});
				});
			});
		});
	});
});