#!/usr/bin/env node

/**
 * Generate service worker with dynamic cache version from environment variables
 * Uses Vercel's deployment ID or Git commit SHA for cache versioning
 */

const fs = require('fs');
const path = require('path');

// Get cache version from environment variables
// Priority: VERCEL_DEPLOYMENT_ID > VERCEL_GIT_COMMIT_SHA > fallback to timestamp
const getCacheVersion = () => {
  if (process.env.VERCEL_DEPLOYMENT_ID) {
    return process.env.VERCEL_DEPLOYMENT_ID;
  }
  
  if (process.env.VERCEL_GIT_COMMIT_SHA) {
    return process.env.VERCEL_GIT_COMMIT_SHA.substring(0, 7); // Use short SHA
  }
  
  // Fallback for local development
  return `dev-${Date.now()}`;
};

const cacheVersion = getCacheVersion();
const templatePath = path.join(__dirname, '..', 'public', 'sw.template.js');
const outputPath = path.join(__dirname, '..', 'public', 'sw.js');

// Read the template
const template = fs.readFileSync(templatePath, 'utf8');

// Replace the placeholder with actual cache version
const serviceWorker = template.replace(
  '{{CACHE_VERSION}}',
  cacheVersion
);

// Write the generated service worker
fs.writeFileSync(outputPath, serviceWorker, 'utf8');

console.log(`✓ Service worker generated with cache version: ${cacheVersion}`);
console.log(`  Source: ${templatePath}`);
console.log(`  Output: ${outputPath}`);
