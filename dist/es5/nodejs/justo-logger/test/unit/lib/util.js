//imports
const format = require("../../../dist/es5/nodejs/justo-logger/lib/util").format;

//suite
describe("util", function() {
  describe("#format()", function() {
    it("format()", function() {
      format().must.be.eq("");
    });

    it("format(msg)", function() {
      format("My message").must.be.eq("My message");
    });

    it("format(pattern, param1, param2...)", function() {
      format("Hi, %s, %s", "VIT", "how are you?").must.be.eq("Hi, VIT, how are you?");
    });
  });
});
