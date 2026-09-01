import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema.js";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL is not set. Copy .env.example to .env and fill it in.");
}

export const pool = new Pool({ connectionString: databaseUrl });

// The Better Auth Drizzle adapter needs the schema object passed explicitly
// (it cannot introspect table names from the pool connection alone).
export const db = drizzle(pool, { schema });
