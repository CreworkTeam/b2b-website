require('dotenv').config();
const { Client } = require('pg');

const connectionCandidates = [
  process.env.DATABASE_URL,
  process.env.DIRECT_URL,
].filter(Boolean);

async function testAll() {
  for (const connStr of connectionCandidates) {
    console.log("\nTesting connection string:", connStr.replace(/:[^:@]+@/, ':****@'));
    const client = new Client({
      connectionString: connStr,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 5000,
    });
    try {
      await client.connect();
      console.log("SUCCESS! Connected cleanly!");
      const res = await client.query('SELECT count(*) FROM leads');
      console.log("Leads count in DB:", res.rows[0].count);
      await client.end();
      return connStr;
    } catch (err) {
      console.error("FAILED:", err.message);
    }
  }
  console.log("\nNone of the connection candidates succeeded.");
}

testAll();
