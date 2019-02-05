import { uuid, random } from "./util";
import { event } from "./event";

export function slide(rack, position) {
  const timer = rack.scanner.timer;
  const id = uuid();
  const height = random(30);
  const width = random(30);
  const area = height * width;
  const scanTime = (area / 300) * 30 + random(16, -8);

  const slide = {
    rack,
    id,
    position,
    height,
    width,
    area,
    scanTime,
    startTime: null,
    endTime: null
  };

  function load() {
    slide.startTime = timer.time;
    event("SlideLoaded", slide);
    return timer.wait(10);
  }
  function process() {
    return timer.wait(scanTime);
  }
  function unload() {
    slide.endTime = timer.time;
    event("SlideUnloaded", slide);
    event("ScanCompleted", slide);
    return timer.wait(10);
  }

  const api = {
    async process() {
      await load();
      await process();
      await unload();
    }
  };
  return { slide, api };
}
