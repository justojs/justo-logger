//imports
import * as util from "util";

/**
 * Formats the message.
 *
 * @overload
 * @param msg:string      The message.
 *
 * @overload Using util.format() format.
 * @param format:string    The format pattern.
 * @param params:object[]  The parameters.
 */
export function format(...args) {"use strict";
  var res;

  //(1) format
  if (args.length === 0) {
    res = "";
  } else if (args.length == 1) {
    res = args[0];
  } else {
    res = util.format(args[0], ...(args.slice(1)));
  }

  //(2) return
  return res;
}
