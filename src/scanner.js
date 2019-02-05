import { uuid, random } from "./util";
import { rack } from "./rack";

function debug(...args) {
  // console.log(...args);
}

export function scanner(globalTimer) {
  const timer = globalTimer.fork();
  const id = uuid();

  const scanner = {
    timer,
    id
  };

  let isRunning = false;
  const racks = new Array(15).fill(null);
  const queue = [];
  let currentRack;

  function tick() {
    if (isRunning) {
      // Maybe add new rack
      const nextRackPosition = random(14, 0);
      if (!racks[nextRackPosition]) {
        const nextRack = rack(scanner);
        racks[nextRackPosition] = nextRack;
        queue[queue.length] = nextRack;
        nextRack.load(nextRackPosition + 1);
      }
      if (!currentRack && queue.length > 0) {
        currentRack = queue[0];
        debug("set current rack 0", racks.indexOf(currentRack));
      }
      if (currentRack) {
        if (currentRack.status === "idle") {
          currentRack.process();
          debug("processing");
        } else if (currentRack.status === "done") {
          const ix = racks.indexOf(currentRack);
          debug("unloading", ix);
          currentRack.unload();
          racks[ix] = null;
          currentRack = null;
          queue.shift();
        }
      }
      setTimeout(tick);
    }
    // debug(racks.map(r => !!r));
    // debug(queue.length);
  }

  return {
    start() {
      isRunning = true;
      tick();
    },
    stop() {
      isRunning = false;
    }
  };
}
