export var writer = {
  get ConsoleWriter() {
  	return require("./writer/ConsoleWriter").ConsoleWriter;
  },
  
  get ColoredConsoleWriter() {
  	return require("./writer/ColoredConsoleWriter").ColoredConsoleWriter;
  },
  
  get FileWriter() {
  	return require("./writer/FileWriter").FileWriter;
  },
  
  get RollingFileWriter() {
  	return require("./writer/RollingFileWriter").RollingFileWriter;
  }
};