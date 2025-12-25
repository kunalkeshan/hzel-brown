# Scripts

This directory contains build and utility scripts for the project.

## generate-sw.js

Generates the service worker (`public/sw.js`) from the template (`public/sw.template.js`) with a dynamic cache version.

### Usage

```bash
# Run manually
npm run generate:sw

# Runs automatically during dev and build
npm run dev
npm run build
```

### Cache Version Sources

The script uses Vercel environment variables in this priority order:

1. **VERCEL_DEPLOYMENT_ID** (recommended)
   - Unique identifier for each Vercel deployment
   - Example: `dpl_abc123xyz456`
   - Automatically available in all Vercel deployments

2. **VERCEL_GIT_COMMIT_SHA**
   - Git commit hash (shortened to 7 characters)
   - Example: `abc123d` (from `abc123def456...`)
   - Available when repository is connected to Vercel

3. **Fallback** (local development)
   - Timestamp-based version
   - Example: `dev-1766696503147`
   - Used when Vercel variables are not available

### How It Works

1. Reads `public/sw.template.js`
2. Replaces `{{CACHE_VERSION}}` placeholder with actual version
3. Writes result to `public/sw.js`
4. Logs cache version for verification

### Testing

Test with specific environment variables:

```bash
# Test with deployment ID
VERCEL_DEPLOYMENT_ID=test-123 npm run generate:sw

# Test with Git commit SHA
VERCEL_GIT_COMMIT_SHA=abc123def456 npm run generate:sw

# Test fallback (no env vars)
npm run generate:sw
```

### Output Example

```
✓ Service worker generated with cache version: dpl_abc123xyz456
  Source: /path/to/public/sw.template.js
  Output: /path/to/public/sw.js
```

### Notes

- `public/sw.js` is gitignored (generated file)
- Always edit `public/sw.template.js`, not `public/sw.js`
- Script runs automatically before dev and build commands
- Each deployment gets a unique cache version for automatic PWA updates
