import path from "path";
import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config({
  path: path.resolve(__dirname, ".././process.env")
})

const PGURI = process.env.PGURI
console.log(PGURI)
const pool = new Pool({
  connectionString: PGURI
})

export const db = {
  query: (text, params, callback) => {
    console.log('Executed query: ', text);
    return pool.query(text, params, callback);
  },
};
