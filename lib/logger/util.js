/**
 * Builds the line to write.
 *
 * @param entry:LogEntry      The log entry to build.
 * @param patterns:object     The level patterns.
 * @param colorLevel:function Colors the level name.
 * @return string
 */
export function format(entry, patterns, colorLevel) {
  "use strict";

  var line;

  //(1) format
  line = patterns[entry.level.name.toLowerCase()];
  if (colorLevel) line = line.replace("%l", colorLevel(entry));
  else line = line.replace("%l", entry.level.name);
  line = line.replace("%s", entry.source.name);
  line = line.replace("%t", formatTimestamp(entry));
  line = line.replace("%m", entry.message);

  //(2) return
  return line;
}

/**
 * Formats a timestamp.
 *
 * @param entry:LogEntry  The entry.
 * @return string
 */
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

  return year + "-" + mon + "-" + day + " " + hour + ":" + min + ":" + sec;
}
