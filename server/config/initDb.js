const fs = require('fs');
const path = require('path');
const db = require('./db');

async function initDb() {
  const schemaPath = path.join(__dirname, '..', 'database.sql');
  if (!fs.existsSync(schemaPath)) {
    throw new Error(`Schema file not found: ${schemaPath}`);
  }

  const schemaSql = fs.readFileSync(schemaPath, { encoding: 'utf8' });
  const statements = schemaSql
    .split(';')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  const client = await db.getClient();
  try {
    await client.query('BEGIN');
    for (const sql of statements) {
      await client.query(sql);
    }
    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }

  console.log('Database initialized successfully.');
}

module.exports = initDb;

