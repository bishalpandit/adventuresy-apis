import { pool } from './configs/db.js'
import dotenv, { config } from 'dotenv'


dotenv.config()

try {
    const res = await pool.query('select * from cron.job')
    console.log(res);
} catch (error) {
    console.log(error);
}

