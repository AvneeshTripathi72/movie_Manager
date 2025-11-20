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
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');
    
    const statements = sqlContent
      .replace(/--.*$/gm, '')
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);

    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD
    });

    console.log('🔌 Connected to MySQL');

    for (const statement of statements) {
      try {
        await connection.query(statement);

      } catch (err) {
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
  require('dotenv').config({ override: true });
  await initDb();
}

main();
