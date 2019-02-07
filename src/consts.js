const MS = 1;
const SECONDS = 1000;
const MINUTES = 60 * SECONDS;
const HOURS = 60 * MINUTES;
const DAYS = 24 * HOURS;

// config stuff
export const scannerCount = 4;
// "speed" is a simple multiplier; 1000 means 1 ms in real time = 1 second in sim time. Note that this impacts the timer's
// resolution: with a multipler of 1000 each timer increment is 1 second and a multiplier of 300000 is 5 minutes.
export const speed = 1000;
export const updateInterval = 10 * MS;
export const runtime = 2 * HOURS;

export const sqlConfig = {
    driver: 'msnodesqlv8',
    connectionString: 'server=.;Database=Segue;Trusted_Connection=Yes;Driver={SQL Server Native Client 11.0}',
};
