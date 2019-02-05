import { uuid, random } from "./util";
import { event } from "./event";
import { slide } from "./slide";

export function rack(scanner) {
  const timer = scanner.timer;
  const type = rackType();
  const rack = {
    scanner,
    type,
    id: uuid(),
    position: null,
    loadedTime: null,
    unloadedTime: null
  };

  // Fill the rack with slides and some empty slots
  const slides = new Array(type.capacity)
    .fill(0)
    .map((x, pos) => (random(10) === 10 ? null : slide(rack, pos + 1)));
  rack.slides = slides.map(s => (s ? s.slide : null));

  let status = "idle";

  return {
    get status() {
      return status;
    },
    load(position) {
      rack.position = position;
      rack.loadedTime = timer.time;
      event("RackLoaded", rack);
    },
    async process() {
      status = "running";
      await timer.wait(10); // simulate loading the rack
      for (let slide of slides) {
        slide && (await slide.api.process());
        await timer.wait(10); // simulate unloading a slide
      }
      await timer.wait(10); // simulate unloading the rack
      status = "done";
    },
    unload() {
      rack.unloadedTime = timer.time;
      event("RackUnloaded", rack);
    }
  };
}

function rackType() {
  let type = random(20);
  const capacity = type === 20 ? 20 : 30; // most racks have 20 slots
  type /= 10;
  return {
    type,
    capacity
  };
}
