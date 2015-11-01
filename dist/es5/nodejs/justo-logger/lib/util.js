"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.format = format;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

var _util = require("util");

var util = _interopRequireWildcard(_util);

function format() {
  "use strict";
  var res;

  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  if (args.length === 0) {
    res = "";
  } else if (args.length == 1) {
    res = args[0];
  } else {
    res = util.format.apply(util, [args[0]].concat(_toConsumableArray(args.slice(1))));
  }

  return res;
}
