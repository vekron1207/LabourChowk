const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Supabase connection (using connection pooler)
const connectionString = 'postgresql://postgres.rzrxtersdpqwxealyzme:110043@vV110043@aws-1-ap-northeast-2.pooler.supabase.com:5432/postgres';

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

async function setupDatabase() {
  const client = await pool.connect();

  try {
    console.log('Connected to Supabase PostgreSQL...');

    // Read schema file
    const schemaPath = path.join(__dirname, 'config', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    console.log('Executing schema...');
    await client.query(schema);

    console.log('✓ Database schema initialized successfully!');
    console.log('✓ Tables created: users, labour_profiles, jobs, job_applications, counter_offers');

  } catch (error) {
    console.error('Error setting up database:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

setupDatabase();
