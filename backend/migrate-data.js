require('dotenv').config();
const { Client } = require('pg');

const SUPABASE_URL = "postgresql://postgres.pkyjcwxmjvvomsnoudah:Supa100%23Mania@aws-1-ap-northeast-2.pooler.supabase.com:5432/postgres";
const NEON_URL = process.env.DIRECT_URL || process.env.DATABASE_URL;

async function migrateData() {
  console.log("--------------------------------------------------");
  console.log("Starting Data Migration: Supabase -> NeonDB");
  console.log("--------------------------------------------------\n");

  const supabaseClient = new Client({
    connectionString: SUPABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  const neonClient = new Client({
    connectionString: NEON_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await supabaseClient.connect();
    console.log("✅ Connected to Supabase");

    await neonClient.connect();
    console.log("✅ Connected to NeonDB");

    console.log("\nFetching leads from Supabase...");
    const res = await supabaseClient.query("SELECT * FROM leads ORDER BY captured_at ASC");
    const leads = res.rows;
    console.log(`Found ${leads.length} lead(s) in Supabase.`);

    if (leads.length === 0) {
      console.log("No data to migrate.");
      return;
    }

    console.log("\nMigrating leads into NeonDB...");
    let count = 0;
    for (const lead of leads) {
      const query = `
        INSERT INTO leads (id, session_id, email, archetype, q1, q2, q3, q4, lead_tag, captured_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        ON CONFLICT (session_id) DO UPDATE SET
          email = EXCLUDED.email,
          archetype = EXCLUDED.archetype,
          q1 = EXCLUDED.q1,
          q2 = EXCLUDED.q2,
          q3 = EXCLUDED.q3,
          q4 = EXCLUDED.q4,
          lead_tag = EXCLUDED.lead_tag,
          captured_at = EXCLUDED.captured_at;
      `;
      const values = [
        lead.id,
        lead.session_id,
        lead.email,
        lead.archetype,
        lead.q1,
        lead.q2,
        lead.q3,
        lead.q4,
        lead.lead_tag,
        lead.captured_at,
      ];
      await neonClient.query(query, values);
      count++;
    }

    console.log(`\n🎉 Successfully migrated ${count} lead(s) to NeonDB!`);
  } catch (error) {
    console.error("❌ Data Migration Error:", error.message);
  } finally {
    await supabaseClient.end();
    await neonClient.end();
  }
}

migrateData();
