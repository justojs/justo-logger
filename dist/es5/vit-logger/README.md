# vit-logger

A simple logger for JavaScript.

Proudly developed in JavaScript (ES6) from Valencia, Spain.

## Usage

```
npm install vit-logger
```


By convention, the package should be imported as `vlog`:

```
const vlog = require("vit-logger");
```

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

- `minLevel` (Level). Minimum level to write. Default: `Level.INFO`.
- `maxLevel` (Level). Maximum level to write. Default: `Level.FATAL`.

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

## Writers

A writer is a component that writes the log entries to a device, for example, the console, a file,
a database, etc.

We can create any number of writers for a logger. Once created, we have to associate it to the logger,
using the `Logger.onWrite()` method. For example:

```
logger.onWrite(new ConsoleWriter());
``` 

### Format pattern

The writer has associated a pattern that formats the output. This pattern is a string that can
use the following wildcards:

- `%s`. The source qualified name.
- `%l`. The level. DEBUG, INFO, WARN, etc.
- `%t`. The timestamp: yyyy-mm-dd hh:mm:ss.
- `%m`. The message.

The default pattern is `%l [%t]: %m`.

### ConsoleWriter

The `ConsoleWriter` writes the log entries in the console. Constructors:

```
new ConsoleWriter()
new ConsoleWriter(pattern : string)
```

The writer writes the DEBUG and INFO entries using `console.log()`, while the other levels with `console.error()`.

### ColoredConsoleWriter

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

## TODO

- File writers.
- Database writers.