export const Level = require("./Level");
export const LogEntry = require("./LogEntry");
export const Loggers = require("./Loggers");
export const Logger = require("./Logger");
export const logger = {
  get ConsoleLogger() {
    "use strict";
    return require("./logger/ConsoleLogger");
  },

  get ColoredConsoleLogger() {
    "use strict";
    return require("./logger/ColoredConsoleLogger");
  },

  get FileLogger() {
    "use strict";
    return require("./logger/FileLogger");
  },

  get RollingFileLogger() {
    "use strict";
    return require("./logger/RollingFileLogger");
  }
};
