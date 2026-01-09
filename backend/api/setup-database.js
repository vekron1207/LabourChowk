const fs = require('fs');
const path = require('path');
const pool = require('./config/database');

async function setupDatabase() {
  try {
    console.log('Setting up database schema...');

    const schemaSQL = fs.readFileSync(
      path.join(__dirname, 'config', 'schema.sql'),
      'utf8'
    );

    await pool.query(schemaSQL);

    console.log('Database schema created successfully!');
    console.log('Tables created:');
    console.log('- users');
    console.log('- labour_profiles');
    console.log('- jobs');
    console.log('- job_applications');
    console.log('- counter_offers');

    process.exit(0);
  } catch (error) {
    console.error('Error setting up database:', error);
    process.exit(1);
  }
}

setupDatabase();
