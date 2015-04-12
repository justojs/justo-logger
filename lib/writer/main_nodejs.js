export const writer = {
  get ConsoleWriter() {
  	"use strict";
  	
  	return require("./writer/ConsoleWriter").ConsoleWriter;
  },
  
  get ColoredConsoleWriter() {
  	"use strict";
  	
  	return require("./writer/ColoredConsoleWriter").ColoredConsoleWriter;
  },
  
  get FileWriter() {
  	"use strict";
  	
  	return require("./writer/FileWriter").FileWriter;
  },
  
  get RollingFileWriter() {
  	"use strict";
  	
  	return require("./writer/RollingFileWriter").RollingFileWriter;
  }
};