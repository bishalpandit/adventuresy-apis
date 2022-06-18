import chalk from "chalk";
import pg from "pg"
import dotenv from 'dotenv'

dotenv.config();

export const db = new pg.Pool({
    host: process.env.PGHOST,
    user: process.env.PGUSER,
    port: process.env.PGPORT,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    ssl: true,
})

export const connectDB = async () => {
    try {
        const connection = await db.connect();
        console.log(chalk.yellowBright('PostgreSQL Connected :D'));
        return connection;
    } catch (err) {
        if (err instanceof Error) console.error(chalk.redBright(err.message));
    }
};

export const PORT = process.env.PORT || 5000;

export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

export const SUCCESS_URL = process.env.SUCCESS_URL + '/home' || 'http://localhost:3000/home';

export const LOGIN_URL = process.env.LOGIN_URL || 'http://localhost:3000/splash';

export const COOKIE_SECRET = process.env.COOKIE_SECRET;

