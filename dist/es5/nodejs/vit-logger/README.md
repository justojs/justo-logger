[![Build Status](https://travis-ci.org/vitxorg/vit-logger.svg?branch=master)](https://travis-ci.org/vitxorg/vit-logger)

A simple logger for Node.js and browsers.

*Proudly made in Valencia, Spain, EU.*

Features:

- The logger supports several levels: DEBUG, INFO, WARN, ERROR and FATAL.
- The logger supports several writers: console, colored console, file and rolling file.
- Each writer can configure its own format pattern.

## Usage

```
npm install vit-logger
```


By convention, the package should be imported as `vlog`:

```
const vlog = require("vit-logger");
```

## Table of contents

1. [Architecture](#architecture)
2. [Logger](#logger)
3. [Writers](#writers)

------------------

## Architecture

We have two basic components:

- `Logger`. Component with which the user must interact.
- `Writer`. Component that writes the log entries in the console, a file, a database, etc.

A logger can have zero, one or more writers associated.
The user must associate the writers to the logger, being the logger which passes the log entries to the writers.
If we don't associate any writer, nothing will be write.

Here's an illustrative example:

```
//(1) create logger and writer
var logger = new Logger("app", {minLevel: Level.INFO, maxLevel: Level.FATAL});
logger.onWrite(new ConsoleWriter());

//(2) create log entries
logger.debug("My debug message");
logger.info("My info message");
logger.warn("My warn message");
logger.error("My error message");
logger.fatal("My fatal message");
```

The writer will receive the entries INFO, WARN, ERROR and FATAL, but not DEBUG, because we
have configured the logger to write only the messages with level greater than or equal to INFO.

------------------

## Logger

The logger is the component that receives the log messages. When the user registers a log message,
the logger creates a log entry that is passed to the writers if the entry level is greater than
or equal to the min level configured in the logger.

The log entry contains:

- The source.
- The level.
- The timestamp, when the entry was created.
- The message.

For creating a logger, we can use the following constructors:

```
new Logger(name : string)
new Logger(name : string, config : object)
new Logger(parent : Logger, name : string)
new Logger(parent : Logger, name : string, config : object)
```

The `parent` is the parent logger. We can create a hierarchy of loggers, for example, a root logger to
the application and one child logger for each component. All loggers must have a `name`. Finally, the
`config` parameter contains the configuration of the logger:

- `minLevel` (Level|string). Minimum level to write. Default: `Level.INFO`.
- `maxLevel` (Level|string). Maximum level to write. Default: `Level.FATAL`.

### Level

The level indicates the importance of the entry, from minor to major:

- `DEBUG`. Debug Message. Only used when development.
- `INFO`. Informational message.
- `WARN`. Warning message. For example, the use of something deprecated.
- `ERROR`. Error message. Something has gone wrong, but the app or component can
  continue working.
- `FATAL`. Fatal error message. Something has gone wrong and the app or component
  can't continue working.

By type of level, we must use the following logger methods:

```
logger.debug(msg : string)
logger.info(msg : string)
logger.warn(msg : string)
logger.error(msg : string)
logger.fatal(msg : string)
```

The messages can be specified passing several arguments, which will be formated by
`util.format()`. For example:

```
logger.debug("The user '%s' has been '%s'.", user.username, user.status);
```

#### Min level and max level

The logger can be configured indicating the minimum level and maximum level
to write using the properties `minLevel` and `maxLevel`. We can use a `Level`
item or a string:

```
logger.minLevel = "info";
logger.minLevel = "INFO";
logger.minLevel = Level.INFO;
```

------------------

## Writers

A writer is a component that writes the log entries to a device, for example, the console, a file,
a database, etc.

We can create any number of writers for a logger. Once created, we have to associate it to the logger,
using the `Logger.onWrite()` method. For example:

```
logger.onWrite(new ConsoleWriter());
```

### Namespace

The writers have their own namespace into the `vit-logger` library, the `writer` property.
Example:

```
const vlog = require("vit-logger");
const ConsoleWriter = vlog.writer.ConsoleWriter;
```

### Format pattern

The writer has associated a pattern that formats the output. This pattern is a string that can
use the following wildcards:

- `%s`. The source qualified name.
- `%l`. The level. DEBUG, INFO, WARN, etc.
- `%t`. The timestamp: yyyy-mm-dd hh:mm:ss.
- `%m`. The message.

The default pattern is `%l [%t]: %m`.

### Console writers

The library implements two writers for console: `ConsoleWriter` and `ColoredConsoleWriter`.

#### writer.ConsoleWriter

The `ConsoleWriter` writes the log entries in the console. Constructors:

```
new ConsoleWriter()
new ConsoleWriter(pattern : string)
```

The writer writes the DEBUG and INFO entries using `console.log()`, while the other levels with `console.error()`.

#### writer.ColoredConsoleWriter

The `ColoredConsoleWriter` is similar to `ConsoleWriter` but always uses `console.log()`, but writes
the message with colors.

Constructors:

```
new ColoredConsoleWriter()
new ColoredConsoleWriter(pattern : string)
new ColoredConsoleWriter(theme : object)
new ColoredConsoleWriter(pattern : string, theme : object)
```

Example:

```
var logger = new Logger("app");
logger.onWrite(new ColoredConsoleWriter({
  debug: "grey",
  info: "white",
  warn: "yellow",
  error: "red",
  fatal: "red"
}));
```

When a colored console writer is used, we have to create themes, objects with the colors for each
level. Right now, we can use the following colors:

- black
- blue
- cyan
- gray
- green
- grey
- magenta
- red
- white
- yellow

### File writers

The library contains two writers for writing in log files: `FileWriter` and `RollingFileWriter`.

#### writer.FileWriter

A `FileWriter` writes in a file. It can be synchronous or asynchronous.

Constructors:

```
new FileWriter(dirPath : string, fileName : string)
new FileWriter(dirPath : string, fileName : string, options : object)
new FileWriter(pattern : string, dirPath : string, fileName : string)
new FileWriter(pattern : string, dirPath : string, fileName : string, options : object)
```

The `pattern` parameter indicates the format pattern. `dirPath` and `fileName` indicate the
directory path and file name, respectively. And the `options` parameter contains writer options:

- `sync` (Boolean). Is it synchronous? Default: false.
- `batch` (Number). The batch size. Default: 1.

Example:

```
//synchronous writer
logger.onWrite(new FileWriter(os.tmpdir(), "my.log", {sync: true}));

//asynchrnous writer
logger.onWrite(new FileWriter(os.tmpdir(), "my.log"));
```

#### writer.RollingFileWriter

A `RollingFileWriter` is similar to `FileWriter`, but also to archive the log file when it reaches
a certain size automatically.

This type of writer is always synchronous.

Constructors:

```
new FileWriter(dirPath : string, fileName : string)
new FileWriter(dirPath : string, fileName : string, options : object)
new FileWriter(pattern : string, dirPath : string, fileName : string)
new FileWriter(pattern : string, dirPath : string, fileName : string, options : object)
```

The `pattern` parameter indicates the format pattern. `dirPath` and `fileName` indicate the
directory path and file name, respectively. And the `options` parameter contains writer options:

- `batch` (Number). The batch size. Default: 1.
- `maxSize` (Number). The maximum size, in bytes, that the file can reach.
- `maxArchives` (Number). The maximum number of archives that the writer must maintain.

#### Batch mode

The file writers can be configured for writing entries in batch. The config option `batch` allows
to configure the size. For example, when we set the batch size to 20, the writer will buffer the entries until the
size is reached. There is only one exception, if we register an entry with a log level greater than or equal to WARN,
the writing trigger is issued, without reaching the batch size.

The batch mode reduces the disk I/O.

------------------

## TODO

- Database writers.
