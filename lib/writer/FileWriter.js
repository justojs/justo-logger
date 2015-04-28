//imports
const fs = require("fs");
const path = require("path");
const vlog = require("vit-logger");
const Writer = vlog.Writer;
const Level = vlog.Level;

/**
 * A file writer.
 *
 * @readonly dirPath:string              The directory.
 * @readonly fileName:string            The file name.
 * @readonly synchronous:boolean        Is it synchrnous?
 * @readonly batch:number                The batch size.
 * @readonly(private) trigger:Level      The batch level trigger.
 * @readonly(private) buffer:Entry[]    The entries for writing.
 * @readonly(private) encoding:string    The encoding.
 * @readonly(private) mode:number        The file mode.
 * @readonly(private) opOptions:object  The append options.
 */
export class FileWriter extends Writer {
  /**
   * Constructor.
   *
   * @overload
   * @param(attr) dirPath
   * @param(attr) fileName
   * @param [opts]:object      The writer options: sync and batch.
   *
   * @overload
   * @param(attr) pattern
   * @param(attr) dirPath
   * @param(attr) fileName
   * @param [opts]:object      The writer options: sync and batch.
   */
  constructor(...args) {
    var pattern, dirPath, fileName, opts;

    //(1) pre: arguments
    if (args.length == 2) {
      [dirPath, fileName] = args;
    } else if (args.length == 3) {
      if (typeof(args[2]) == "string") [pattern, dirPath, fileName] = args;
      else [dirPath, fileName, opts] = args;
    } else if (args.length > 3) {
      [pattern, dirPath, fileName, opts] = args;
    }

    if (!opts) opts = {};

    //(2) superconstructor
    super(pattern);

    //(3) init
    Object.defineProperty(this, "dirPath", {value: dirPath, enumerable: true});
    Object.defineProperty(this, "fileName", {value: fileName, enumerable: true});
    Object.defineProperty(this, "synchronous", {value: !!opts.sync, enumerable: true});
    Object.defineProperty(this, "batch", {value: opts.batch || FileWriter.DEFAULT_OPTIONS.batch});
    Object.defineProperty(this, "trigger", {value: Level.WARN});
    Object.defineProperty(this, "buffer", {value: []});
    Object.defineProperty(this, "encoding", {value: FileWriter.DEFAULT_OPTIONS.encoding});
    Object.defineProperty(this, "mode", {value: FileWriter.DEFAULT_OPTIONS.mode});
    Object.defineProperty(this, "opOptions", {value: {encoding: this.encoding, mode: this.mode}});
  }

  /**
   * @alias synchrnous
   */
  get sync() {
    return this.synchronous;
  }

  /**
   * Is it asynchronous?
   *
   * @type boolean
   */
  get asynchronous() {
    return !this.sync;
  }

  /**
   * @alias asynchronous
   */
  get async() {
    return this.asynchronous;
  }

  /**
   * The file path.
   *
   * @return string
   */
  get filePath() {
    return path.join(this.dirPath, this.fileName);
  }

  /**
   * @private
   */
  buildBufferContent() {
    var con;

    //(1) build content
    con = "";

    while (this.buffer.length > 0) {
      con += this.format(this.buffer.shift()) + "\n";
    }

    //(2) return
    return con;
  }

  /**
   * @override
   */
  write(entry) {
    //(1) push entry
    this.buffer.push(entry);

    //(2) must we write batch buffer?
    if (entry.level.value >= this.trigger.value || this.buffer.length >= this.batch) {
      this.writeBuffer();
    }
  }

  /**
   * Writes the buffered entries.
   *
   * @private
   */
  writeBuffer() {
    var con = this.buildBufferContent();

    if (this.sync) this.writeSync(con);
    else this.writeAsync(con);
  }

  /**
   * Writes the specified one, synchronously.
   *
   * @protected
   * @param con:string  The content to write.
   */
  writeSync(con) {
    fs.appendFileSync(this.filePath, con, this.opOptions);
  }

  /**
   * Writes the batch buffer asynchronously.
   *
   * @protected
   * @param con:string  The content to write.
   */
  writeAsync(con) {
    fs.appendFile(this.filePath, con, this.opOptions, function(error) {
      if (error) throw new Error(error);
    });
  }
}

Object.defineProperty(FileWriter, "DEFAULT_OPTIONS", {
  value: {
    sync: false,
    batch: 1,
    encoding: "utf8",
    mode: 438
  }
});
