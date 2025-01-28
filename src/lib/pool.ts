import { Pool } from "pg";

const ssl =
  process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 15000,
});

pool.on("error", (err: Error) => {
  console.error("Database pool error", err);
});

export default pool;
