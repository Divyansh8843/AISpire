#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Setting up Prisma for Vercel deployment...');

try {
  // Generate Prisma client with proper binary targets
  console.log('📦 Generating Prisma client...');
  execSync('npx prisma generate', { 
    stdio: 'inherit',
    env: { ...process.env, PRISMA_GENERATE_SKIP_POSTINSTALL: 'true' }
  });
  
  // Check if we're in production
  if (process.env.NODE_ENV === 'production') {
    console.log('🚀 Production environment detected');
    console.log('📊 Pushing database schema...');
    execSync('npx prisma db push', { stdio: 'inherit' });
  }
  
  console.log('✅ Prisma setup completed successfully!');
} catch (error) {
  console.error('❌ Error during Prisma setup:', error.message);
  process.exit(1);
} 