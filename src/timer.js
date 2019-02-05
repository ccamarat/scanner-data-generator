import { speed, updateInterval } from "./consts";

export function timer(startTime = 1499999999999) {
  let time = new Date(startTime);
  const t = {
    get time() {
      return time;
    },
    wait(howlongSec = 0) {
      time = new Date(time.getTime() + howlongSec * 1000);
      return wait(howlongSec / speed);
    },
    fork() {
      return timer(time.getTime());
    }
  };
  setInterval(() => {
    t.wait((speed * updateInterval) / 1000);
  }, updateInterval);
  return t;
}

function wait(howLong = 0) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, howLong);
  });
}
