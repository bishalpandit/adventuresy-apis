import pg from "pg"

const config = {
    host: process.env.PGHOST,
    user: process.env.PGUSER,
    port: process.env.PGPORT,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    ssl: true,
}

export const pool = new pg.Pool(config)