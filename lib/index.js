export const Level = require("./Level");
export const Logger = require("./Logger");
export const Writer = require("./Writer");
export const writer = {
  get ConsoleWriter() {
    "use strict";
    return require("./writer/ConsoleWriter");
  },

  get ColoredConsoleWriter() {
    "use strict";
    return require("./writer/ColoredConsoleWriter");
  },

  get FileWriter() {
    "use strict";
    return require("./writer/FileWriter");
  },

  get RollingFileWriter() {
    "use strict";
    return require("./writer/RollingFileWriter");
  }
};
