const { Client } = require('pg');
require('dotenv').config();

const SQL = `
DROP TABLE IF EXISTS items;
DROP TABLE IF EXISTS categories;

CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT
);

CREATE TABLE items (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  stock_count INT NOT NULL CHECK (stock_count >= 0),
  category_id INT REFERENCES categories(id) ON DELETE CASCADE
);

INSERT INTO categories (name, description) VALUES
  ('Guitars', 'Acoustic and electric string instruments'),
  ('Keyboards', 'Synthesizers, digital pianos, and MIDI controllers'),
  ('Percussion', 'Drums, cymbals, and acoustic rhythm gear');

INSERT INTO items (name, description, category_id, price, stock_count) VALUES
  ('Fender Stratocaster', 'Classic electric guitar with a versatile sound', 1, 799.99, 12),
  ('Martin D-28', 'Legendary acoustic guitar with rich tone', 1, 2999.00, 4),
  ('Yamaha P-125', '88-key weighted digital piano for home or stage', 2, 649.99, 8),
  ('Roland TR-808 Clone', 'Classic rhythmic drum machine sound', 2, 349.50, 15),
  ('Pearl Export Drum Kit', 'Complete 5-piece acoustic drum set with hardware', 3, 899.00, 3);
`;

async function main() {
	console.log('Seeding database...');
	const client = new Client({
		connectionString: process.env.DATABASE_URL,
	});

	await client.connect();
	await client.query(SQL);
	await client.end();
	console.log('Done seeding!');
}

main().catch((err) => {
	console.error('Error seeding database:', err);
	process.exit(1);
});
