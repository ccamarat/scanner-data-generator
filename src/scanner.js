import { uuid, random } from "./util";
import { rack } from "./rack";

function debug(...args) {
  console.log(...args);
}

export function scanner(id, timer) {
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
      if (!currentRack && queue.length > 0) {
        currentRack = queue[0];
        debug("set current rack:", racks.indexOf(currentRack));
      }
      if (currentRack) {
        if (currentRack.status === "idle") {
          currentRack.process();
          debug("processing", racks.indexOf(currentRack));
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
  }

  async function loadEmptyRack () {
    if (isRunning) {
      // Maybe add new rack
      const nextRackPosition = random(14, 0);
      if (!racks[nextRackPosition]) {
        const nextRack = rack(scanner);
        racks[nextRackPosition] = nextRack;
        queue[queue.length] = nextRack;
        nextRack.load(nextRackPosition + 1);
      }
      await timer.wait(random(3, 120));
      setTimeout(loadEmptyRack);
    }
  }

  // debug(racks.map(r => !!r));
    // debug(queue.length);

  return {
    start() {
      isRunning = true;
      tick();
      loadEmptyRack();
    },
    stop() {
      isRunning = false;
    }
  };
}
