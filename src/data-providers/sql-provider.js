import sql from 'mssql/msnodesqlv8';
import { sqlConfig } from '../consts';

const connection = new sql.ConnectionPool(sqlConfig);
const connectionPromise = connection.connect().then(pool => {
    console.log('Connected to MSSQL')
    return pool;
  })
  .catch(err => {
      console.log('Database Connection Failed: ', err);
  });



export async function exec(query) {
    const pool = await connectionPromise;
    return pool.request().query(query);
}

export function closeConnection () {
    sql.close();
}
