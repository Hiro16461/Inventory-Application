require('dotenv').config();
const { Pool } = require('pg');

console.log(
	'DATABASE_URL is currently:',
	process.env.DATABASE_URL ? 'Defined (Hidden for security)' : 'UNDEFINED!',
);

const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
	ssl:
		process.env.NODE_ENV === 'production'
			? { rejectUnauthorized: false }
			: false,
});

module.exports = pool;