const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config();

const envPath = path.join(__dirname, '.env');
const sqlPath = path.join(__dirname, '../database/database.sql');

async function fixEnv() {
  try {
    let envContent = '';
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8');
    }

    // Check if DB_NAME exists
    if (envContent.includes('DB_NAME=')) {
      envContent = envContent.replace(/DB_NAME=.*/g, 'DB_NAME=movie_booking_system');
    } else {
      envContent += '\nDB_NAME=movie_booking_system';
    }

    fs.writeFileSync(envPath, envContent);
    console.log('✅ Updated .env with DB_NAME=movie_booking_system');
  } catch (error) {
    console.error('❌ Failed to update .env:', error);
  }
}

async function initDb() {
  try {
    // Read SQL file
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');
    
    // Split into individual statements (rough split by semicolon)
    // Remove comments and empty lines for better parsing
    const statements = sqlContent
      .replace(/--.*$/gm, '') // Remove comments
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);

    // Connect to MySQL (without database selected initially to allow CREATE DATABASE)
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD
    });

    console.log('🔌 Connected to MySQL');

    for (const statement of statements) {
      try {
        // Skip USE statement if we want, or just let it run (it works if DB exists)
        await connection.query(statement);

      } catch (err) {
        // Ignore "Database exists" or similar non-fatal errors if possible, 
        // but for this script we want to see errors.
        // However, the SQL script has IF NOT EXISTS, so it should be fine.
        console.error('⚠️ Error executing statement:', statement.substring(0, 50) + '...', err.message);
      }
    }

    console.log('✅ Database initialized successfully!');
    await connection.end();
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
  }
}

async function main() {
  await fixEnv();
  // Reload env after fix
  require('dotenv').config({ override: true });
  await initDb();
}

main();
