import { scannerCount, runtime } from "./consts";
import { timer } from "./timer";
import { scanner } from "./scanner";
import { configure } from "./event";
import { denormalizedSqlReporter as reporter } from "./reporters/index";

const globalTimer = timer();
configure({
  timer: globalTimer,
  reporter: reporter
});
const scanners = new Array(scannerCount)
  .fill(0)
  .map(() => scanner(globalTimer));

function go() {
  scanners.forEach(s => s.start());
}

function stop() {
  scanners.forEach(s => s.stop());
  reporter.report();
}

go();
setTimeout(() => {
  stop();
}, runtime);
