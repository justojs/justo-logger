"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.







format = format;function format(entry, patterns, colorLevel) {
  "use strict";

  var line;


  line = patterns[entry.level.name.toLowerCase()];
  if (colorLevel) line = line.replace("%l", colorLevel(entry));else 
  line = line.replace("%l", entry.level.name);
  line = line.replace("%s", entry.source.name);
  line = line.replace("%t", formatTimestamp(entry));
  line = line.replace("%m", entry.message);


  return line;}








function formatTimestamp(entry) {
  "use strict";

  var ts, day, mon, year, hour, min, sec;

  ts = entry.timestamp;

  day = ts.getDate();
  mon = ts.getMonth() + 1;
  year = ts.getFullYear();
  hour = ts.getHours();
  min = ts.getMinutes();
  sec = ts.getSeconds();

  if (day < 10) day = "0" + day;
  if (mon < 10) mon = "0" + mon;
  if (hour < 10) hour = "0" + hour;
  if (min < 10) min = "0" + min;
  if (sec < 10) sec = "0" + sec;

  return year + "-" + mon + "-" + day + " " + hour + ":" + min + ":" + sec;}
