export const events = [];
let globalTimer;
let reporter;

export function configure(options) {
  globalTimer = options.timer;
  reporter = options.reporter;

  report();
}

export function event(event, data) {
  events.push({ event, data, timestamp: globalTimer.time });
}

function report() {
  let event;
  // eslint-disable-next-line
  while ((event = events.shift())) {
    reporter && reporter.capture(event);
  }
  setTimeout(report, 100);
}
