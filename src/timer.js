import { speed, updateInterval } from "./consts";

export function timer(startTime = 1500000000000) {
  let clock = new Date(startTime);
  const interrupts = [];
  let doneCallback;

  const t = {
    get time() {
      return clock;
    },

    wait(howlongSec = 0) {
      let interrupt = {};
      const promise = new Promise(resolve => {
        interrupt.timeout = new Date(clock.getTime() + howlongSec * 1000);
        interrupt.resolve = resolve;
      });
      interrupts.push(interrupt);
      return promise;
    },

    done (callback) {
      doneCallback = callback;
    }
  };

  // This recursive iife controls the speed of the timer and the resolution at which it updates.
  (function () {
    let lastUpdate = Date.now();
    (function updateClock() {
      const msSinceLastUpdate = Date.now() - lastUpdate;
      lastUpdate += msSinceLastUpdate;
      clock = new Date(clock.getTime() + speed * msSinceLastUpdate);
      interrupts.filter(i => clock > i.timeout).forEach(i => {
        interrupts.splice(interrupts.indexOf(i), 1);
        i.resolve();
      });

      if (doneCallback && interrupts.length === 0) {
        doneCallback();
      } else {
        setTimeout(updateClock, updateInterval);
      }
    }());
  }());

  return t;
}

function wait(howLong = 0) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, howLong);
  });
}
