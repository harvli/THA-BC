import path, { dirname }  from 'path';
import { fileURLToPath } from 'url';

import pkg from 'pg';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const { Pool } = pkg;
dotenv.config({
	path: path.resolve(__dirname, '.././process.env'),
});

const PGURI = process.env.PGURI;
const pool = new Pool({
	connectionString: PGURI,
});

export default {
	query: (text, params, callback) => {
		console.log('Executed query: ', text);
		return pool.query(text, params, callback);
	},
};
