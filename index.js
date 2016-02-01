export {default as Level} from "./lib/Level";
export {default as LogEntry} from "./lib/LogEntry";
export {default as Loggers} from "./lib/Loggers";
export {default as Logger} from "./lib/Logger";
export const logger = {
  get ConsoleLogger() {
    "use strict";
    return require("./lib/logger/ConsoleLogger").default;
  },

  get ColoredConsoleLogger() {
    "use strict";
    return require("./lib/logger/ColoredConsoleLogger").default;
  },

  get FileLogger() {
    "use strict";
    return require("./lib/logger/FileLogger").default;
  },

  get RollingFileLogger() {
    "use strict";
    return require("./lib/logger/RollingFileLogger").default;
  }
};
