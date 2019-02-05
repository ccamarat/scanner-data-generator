export const consoleReporter = {
  capture({ event, data, timestamp }) {
    console.log(event);
  },
  report() {}
};
