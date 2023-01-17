import path from "path";
import Pool from "pg";
import dotenv from "dotenv";

dotenv.config({
  path: path.resolve(__dirname, ".././process.env")
})

const PGURI = process.env.PGURI

const pool = new Pool({
  connectionString: PGURI
})

module.exports = {
  query: (text, params, callback) => {
    console.log('executed query', text);
    return pool.query(text, params, callback);
  },
};
