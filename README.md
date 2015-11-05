[![Build Status](https://travis-ci.org/justojs/justo-logger.svg?branch=master)](https://travis-ci.org/vitxorg/justo-logger)

A simple logger for Node.js.

*Proudly made with ♥ in Valencia, Spain, EU.*

## Usage

```
npm install justo-logger
```

By convention, the package should be imported as `log`:

```
const log = require("justo-logger");
```

## Table of contents

1. [Architecture](#architecture)
2. [Log levels](#log-levels)
3. [Format patterns](#format-patterns)
4. [Console loggers](#console-loggers)
5. [Colored console loggers](#colored-console-loggers)
6. [Loggers](#loggers)

## Architecture

We have a unique component, the logger. A **logger** represents an object to write
log entries. The logger is the component to receive the log messages. When the user
registers a log message, the logger creates a log entry and writes it if the entry
level is greater than or equal to the minimum level configured.

A log entry contains:

- The source logger.
- The level.
- The timestamp, when the entry was created.
- The message.

Here's an illustrative example:

```
//(1) create logger and writer
var logger = new ConsoleLogger("app", {minLevel: Level.INFO, maxLevel: Level.FATAL});

//(2) write log entries
logger.debug("My debug message");
logger.info("My info message");
logger.warn("My warn message");
logger.error("My error message");
logger.fatal("My fatal message");
```

The logger receives the entries `DEBUG`, `INFO`, `WARN`, `ERROR` and `FATAL`,
but it doesn't write `DEBUG`, because we have configured it to write only the
entries with level greater than or equal to `INFO`.

## Levels

The **log level** indicates the importance of the entry, from minor to major:

- `DEBUG`. Debug Message. Only used when development.
- `INFO`. Informational message.
- `WARN`. Warning message. For example, the use of something deprecated.
- `ERROR`. Error message. Something has gone wrong, but the app or component can
  continue working.
- `FATAL`. Fatal error message. Something has gone wrong and the app or component
  can't continue working.

By type of level, we must use the following logger methods:

```
logger.debug(msg)
logger.info(msg)
logger.warn(msg)
logger.error(msg)
logger.fatal(msg)
```

The methods can accept several arguments. Their concatenation is the message.
Example:

```
logger.debug("This", "is", "the", "message");
//similar to
logger.debug("This is the message");
```

## Format patterns

A **format pattern** is a string that describe the entry syntax.

Wildcards:

- `%s`. The source logger name.
- `%l`. The level. DEBUG, INFO, WARN, etc.
- `%t`. The timestamp: yyyy-mm-dd hh:mm:ss.
- `%m`. The message.

The default pattern is `%l [%t]: %m`.

## Console loggers

A **console logger** writes to the console. It writes the `DEBUG` and `INFO` entries
using `console.log()`, while the other levels with `console.error()`.

Constructors:

```
constructor()
constructor(name : string)
constructor(name : string, opts : object)
constructor(opts : object)
```

The logger options are:

- `enabled` (boolean). Must it write the entries? true, yep; false, nope. Default: true.
- `minLevel` (Level). The minimum level to write.
- `maxLevel` (Level). The maximum level to write.
- `pattern` (string). The format pattern for all entries.
- `patterns` (object). The format patterns for specified entries:
  `debug` (string), `info` (string), `warn` (string), `error` (string)
  and/or `fatal` (string).

Example:

```
const log = require("justo-logger");
const ConsoleLogger = log.logger.ConsoleLogger;
const Level = log.Level;

var logger = new ConsoleLogger("app", {
  minLevel: Level.INFO,
  maxLevel: Level.FATAL,
  pattern: "%l: %m",
  patterns: {
    info: "%m"
  }
});
```

The default format pattern is `%l: %m`, except for `INFO` that uses `%m`.
The `DEBUG` entries won't be written, because the minimum level is `INFO`.

## Colored console loggers

A **colored console logger** is similar to `ConsoleLogger`, but always uses `console.log()`
and it writes the level name with colors.

Constructors:

```
constructor()
constructor(name : string)
constructor(name : string, opts : object)
constructor(opts : object)
```

The logger options are:

- `enabled` (boolean). Must it write the entries? true, yep; false, nope. Default: true.
- `minLevel` (Level). The minimum level to write.
- `maxLevel` (Level). The maximum level to write.
- `pattern` (string). The format pattern for all entries.
- `patterns` (object). The format patterns for specified entries:
  `debug` (string), `info` (string), `warn` (string), `error` (string)
  and/or `fatal` (string).
- `theme` (object). The color theme.

When a colored console logger is used, we have to create themes, objects with the colors for each
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

Example:

```
const ColoredConsoleLogger = require("justo-logger").logger.ColoredConsoleLogger;
const Level = require("justo-logger").Level;

var logger = new ColoredConsoleLogger("app", {
  minLevel: Level.INFO,
  maxLevel: Level.FATAL,
  pattern: "%l: %m",
  patterns: {
    info: "%m"
  },
  theme: {
    debug: "gray",
    info: "white",
    warn: "yellow",
    error: "red",
    fatal: "red"
  }
});
```

## Loggers

The `Loggers` class is an array of loggers. This array contains the following
methods:

```
//add a logger
add(logger)

//invoke the *() method of its loggers
debug(msg)
info(msg)
warn(msg)
error(msg)
fatal(msg)
```

Example:

```
const log = require("justo-logger");
const Loggers = log.Loggers;
const ConsoleLogger = log.logger.ConsoleLogger;
const Level = log.Level;

var loggers = new Loggers();
logger.add(new ConsoleLogger({minLogger: Level: INFO}));
logger.add(new ColoredConsoleLogger({minLogger: Level: DEBUG}));

//entry written by the 2nd logger
loggers.debug("the message");

//entry written by all loggers
loggers.info("the message");
```
