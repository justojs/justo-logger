//imports
const vlog = require("vit-logger");
const Writer = vlog.Writer;
const LogEntry = vlog.LogEntry;
const Level = vlog.Level;

//suite
describe("Writer", function() {
	var logger, entry;
	
	beforeEach(function() {
		logger = {name: "app", qn: "app"};
		entry = new LogEntry(logger, Level.INFO, new Date(2015, 2, 30, 18, 53, 45), "My message");
	});
	
	describe("#format()", function() {
		it("format(entry) - %l [%t]: %m", function() {
			var writer = new Writer("%l [%t]: %m");
			writer.format(entry).must.be.equal("INFO [2015-03-30 18:53:45]: My message");
		});
		
		it("format(entry) - %l: %m", function() {
			var writer = new Writer("%l: %m");
			writer.format(entry).must.be.equal("INFO: My message");
		});
		
		it("format(entry) - %l %s [%t]: %m", function() {
			var writer = new Writer("%l %s [%t]: %m");
			writer.format(entry).must.be.equal("INFO app [2015-03-30 18:53:45]: My message");
		});
	});
});