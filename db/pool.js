const { Pool } = require('pg');

if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
}

console.log('--- DATABASE CONNECTION DEBUG ---');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('DATABASE_URL exists?:', !!process.env.DATABASE_URL);
if (process.env.DATABASE_URL) {
	// Print first 15 characters to verify it's reading a postgresql URL, not undefined
	console.log(
		'DATABASE_URL starts with:',
		process.env.DATABASE_URL.substring(0, 15),
	);
} else {
	console.error('CRITICAL: DATABASE_URL is completely missing or empty!');
}
console.log('----------------------------------');

const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
	ssl:
		process.env.NODE_ENV === 'production'
			? { rejectUnauthorized: false }
			: false,
});

module.exports = pool;
