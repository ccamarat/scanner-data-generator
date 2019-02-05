const MS = 1;
const SECONDS = 1000;
const MINUTES = 60 * SECONDS;
const HOURS = 60 * MINUTES;
const DAYS = 24 * HOURS;

// config stuff
export const scannerCount = 4;
export const speed = 99999999;
export const updateInterval = 10 * MS;
export const runtime = 2 * HOURS;

export const sqlConfig = {
    driver: 'msnodesqlv8',
    connectionString: 'server=.;Database=Segue;Trusted_Connection=Yes;Driver={SQL Server Native Client 11.0}',
};
