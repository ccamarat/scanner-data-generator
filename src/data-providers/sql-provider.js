import sql from 'mssql/msnodesqlv8';
import { sqlConfig } from '../consts';


export async function exec(query) {
    try {
        const pool = new sql.ConnectionPool(sqlConfig);
        await pool.connect();
        return pool.request().query(query);
    } finally {
        sql.close();
    }
}
