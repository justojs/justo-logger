//imports
const os = require("os");
const fs = require("fs");
const spy = require("justo-spy");
const log = require("../../../../dist/es5/nodejs/justo-logger");
const FileWriter = log.writer.FileWriter;
const Level = log.Level;
const LogEntry = require("../../../../dist/es5/nodejs/justo-logger/lib/LogEntry");

//suite
describe("writer.FileWriter", function() {
  const TMP_DIR = os.tmpdir();
  const FILE_NAME = "test.log";
  var logger,
      entry, entry2, entry3, entry4, entry5, errorEntry,
      line, line2, line3, line4, line5, errorLine;

  beforeEach(function() {
    logger = {name: "app", qn: "app"};
    entry = new LogEntry(logger, Level.INFO, new Date(2015, 2, 30, 18, 53, 45), "My entry #1");
    entry2 = new LogEntry(logger, Level.DEBUG, new Date(2015, 2, 30, 18, 54, 13), "My entry #2");
    entry3 = new LogEntry(logger, Level.INFO, new Date(2015, 2, 30, 18, 54, 13), "My entry #3");
    entry4 = new LogEntry(logger, Level.DEBUG, new Date(2015, 2, 30, 18, 54, 13), "My entry #4");
    entry5 = new LogEntry(logger, Level.INFO, new Date(2015, 2, 30, 18, 54, 13), "My entry #5");
    errorEntry = new LogEntry(logger, Level.ERROR, new Date(2015, 2, 30, 18, 54, 13), "My error entry");

    line = "INFO: My entry #1\n";
    line2 = "DEBUG: My entry #2\n";
    line3 = "INFO: My entry #3\n";
    line4 = "DEBUG: My entry #4\n";
    line5 = "INFO: My entry #5\n";
    errorLine = "ERROR: My error entry\n";
  });

  describe("#constructor()", function() {
    it("constructor(dirPath, fileName)", function() {
      var writer = new FileWriter(TMP_DIR, FILE_NAME);

      writer.patterns.must.be.equal(FileWriter.DEFAULT_PATTERNS);
      writer.dirPath.must.be.equal(TMP_DIR);
      writer.fileName.must.be.equal(FILE_NAME);
      writer.sync.must.be.equal(FileWriter.DEFAULT_OPTIONS.sync);
      writer.batch.must.be.eq(FileWriter.DEFAULT_OPTIONS.batch);
      writer.buffer.must.be.eq([]);
      writer.encoding.must.be.equal(FileWriter.DEFAULT_OPTIONS.encoding);
      writer.mode.must.be.equal(FileWriter.DEFAULT_OPTIONS.mode);
    });

    it("constructor(dirPath, fileName, opts)", function() {
      var writer = new FileWriter(TMP_DIR, FILE_NAME, {sync: true, batch: 2});

      writer.patterns.must.be.equal(FileWriter.DEFAULT_PATTERNS);
      writer.dirPath.must.be.equal(TMP_DIR);
      writer.fileName.must.be.equal(FILE_NAME);
      writer.sync.must.be.equal(true);
      writer.batch.must.be.eq(2);
      writer.buffer.must.be.eq([]);
      writer.encoding.must.be.equal(FileWriter.DEFAULT_OPTIONS.encoding);
      writer.mode.must.be.equal(FileWriter.DEFAULT_OPTIONS.mode);
    });

    it("constructor(pattern, dirPath, fileName)", function() {
      var writer = new FileWriter("%l: %m", TMP_DIR, FILE_NAME);

      writer.patterns.must.be.equal({
        debug: "%l: %m",
        info: "%l: %m",
        warn: "%l: %m",
        error: "%l: %m",
        fatal: "%l: %m"
      });
      writer.dirPath.must.be.equal(TMP_DIR);
      writer.fileName.must.be.equal(FILE_NAME);
      writer.sync.must.be.equal(FileWriter.DEFAULT_OPTIONS.sync);
      writer.batch.must.be.eq(FileWriter.DEFAULT_OPTIONS.batch);
      writer.buffer.must.be.eq([]);
      writer.encoding.must.be.equal(FileWriter.DEFAULT_OPTIONS.encoding);
      writer.mode.must.be.equal(FileWriter.DEFAULT_OPTIONS.mode);
    });

    it("constructor(pattern, dirPath, fileName, opts)", function() {
      var writer = new FileWriter("%l: %m", TMP_DIR, FILE_NAME, {sync: true, batch: 2});

      writer.patterns.must.be.equal({
        debug: "%l: %m",
        info: "%l: %m",
        warn: "%l: %m",
        error: "%l: %m",
        fatal: "%l: %m"
      });
      writer.dirPath.must.be.equal(TMP_DIR);
      writer.fileName.must.be.equal(FILE_NAME);
      writer.sync.must.be.equal(true);
      writer.batch.must.be.eq(2);
      writer.buffer.must.be.eq([]);
      writer.encoding.must.be.equal(FileWriter.DEFAULT_OPTIONS.encoding);
      writer.mode.must.be.equal(FileWriter.DEFAULT_OPTIONS.mode);
    });
  });

  describe("#write()", function() {
    var writer;

    afterEach(function() {
      fs.unlinkSync(writer.filePath);
    });

    describe("Synchronous writer", function() {
      beforeEach(function() {
        writer = new FileWriter("%l: %m", TMP_DIR, FILE_NAME, {sync: true});
      });

      it("one entry", function() {
        writer.write(entry);
        fs.readFileSync(writer.filePath, {encoding: writer.encoding}).must.be.equal(line);
      });

      it("two entries", function() {
        writer.write(entry);
        writer.write(entry2);
        fs.readFileSync(writer.filePath, {encoding: writer.encoding}).must.be.equal(line + line2);
      });
    });

    describe("Asynchronous writer", function() {
      beforeEach(function() {
        writer = new FileWriter("%l: %m", TMP_DIR, FILE_NAME, {sync: false});
      });

      it("one entry", function(done) {
        writer.write(entry);

        setTimeout(function() {
          fs.readFileSync(writer.filePath, {encoding: writer.encoding}).must.be.equal(line);
          done();
        }, 1000);
      });

      it("two entries", function(done) {
        writer.write(entry);
        writer.write(entry2);

        setTimeout(function() {
          var content = fs.readFileSync(writer.filePath, {encoding: writer.encoding});
          content.must.contain(line);
          content.must.contain(line2);
          done();
        }, 1000);
      });
    });
  });

  describe("Batch mode", function() {
    var writer;

    afterEach(function() {
      if (fs.existsSync(writer.filePath)) fs.unlinkSync(writer.filePath);
    });

    describe("Check number of calls to writeBuffer()", function() {
      beforeEach(function() {
        writer = new FileWriter(TMP_DIR, FILE_NAME, {sync: true, batch: 3});
        writer.writeBuffer = spy(function() {});
      });

      it("writes 1", function() {
        writer.write(entry);
        writer.writeBuffer.spy.called().must.be.eq(0);
        writer.buffer.must.be.eq([entry]);
      });

      it("writes 2", function() {
        writer.write(entry);
        writer.write(entry2);
        writer.writeBuffer.spy.called().must.be.eq(0);
      });

      it("writes 3", function() {
        writer.write(entry);
        writer.write(entry2);
        writer.write(entry3);
        writer.writeBuffer.spy.called().must.be.eq(1);
      });

      it("write error", function() {
        writer.write(errorEntry);
        writer.writeBuffer.spy.called().must.be.eq(1);
      });

      it("write 1 and error", function() {
        writer.write(entry);
        writer.write(errorEntry);
        writer.writeBuffer.spy.called().must.be.eq(1);
      });
    });

    describe("Check buffer and content", function() {
      beforeEach(function() {
        writer = new FileWriter("%l: %m", TMP_DIR, FILE_NAME, {sync: true, batch: 3});
      });

      it("writes 1", function() {
        writer.write(entry);
        writer.buffer.must.be.eq([entry]);
      });

      it("writes 2", function() {
        writer.write(entry);
        writer.write(entry2);
        writer.buffer.must.be.eq([entry, entry2]);
      });

      it("writes 3", function() {
        writer.write(entry);
        writer.write(entry2);
        writer.write(entry3);
        writer.buffer.must.be.eq([]);
        fs.readFileSync(writer.filePath, {encoding: writer.encoding}).must.be.eq(line + line2 + line3);
      });

      it("writes 4", function() {
        writer.write(entry);
        writer.write(entry2);
        writer.write(entry3);
        writer.write(entry4);
        writer.buffer.must.be.eq([entry4]);
        fs.readFileSync(writer.filePath, {encoding: writer.encoding}).must.be.eq(line + line2 + line3);
      });

      it("write error", function() {
        writer.write(errorEntry);
        writer.buffer.must.be.eq([]);
        fs.readFileSync(writer.filePath, {encoding: writer.encoding}).must.be.eq(errorLine);
      });

      it("write 1 and error", function() {
        writer.write(entry);
        writer.write(errorEntry);
        writer.buffer.must.be.eq([]);
        fs.readFileSync(writer.filePath, {encoding: writer.encoding}).must.be.eq(line + errorLine);
      });
    });
  });
});
