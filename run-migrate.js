#!/usr/bin/env node

import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, '.env.local');

// Load .env.local
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  const lines = envContent.split('\n');
  
  lines.forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      const value = valueParts.join('=').replace(/^["']|["']$/g, '');
      process.env[key.trim()] = value;
    }
  });
}

// Run migration reset
try {
  execSync('npx prisma migrate reset --force', {
    stdio: 'inherit',
    cwd: __dirname,
    env: process.env,
  });
  console.log('✅ Migration completed');
} catch (error) {
  console.error('❌ Migration failed:', error.message);
  process.exit(1);
}
