# PWA Cache Invalidation and Content Updates

This document describes how the Hzel Brown PWA handles content updates and cache invalidation when the app is already installed.

## Overview

The PWA implements a multi-layered caching strategy with automatic update detection to ensure users always have access to fresh content while maintaining offline functionality.

## Caching Strategies

### 1. Static Cache (`hzel-brown-static-${version}`)
- **Strategy**: Cache-first with background updates (stale-while-revalidate)
- **Contents**: Static assets like HTML pages, manifest, icons
- **Update mechanism**: Automatic version-based cache invalidation
- **Behavior**: Returns cached content immediately, fetches fresh content in background

### 2. Dynamic Cache (`hzel-brown-dynamic-${version}`)
- **Strategy**: Network-first with cache fallback
- **Contents**: API responses, Sanity CMS content, dynamic data
- **Max size**: 50 entries (oldest entries automatically pruned)
- **Update mechanism**: Always fetches fresh data, falls back to cache if network fails

### 3. Image Cache (`hzel-brown-images-${version}`)
- **Strategy**: Cache-first
- **Contents**: Product images, illustrations, assets
- **Max size**: 60 entries (oldest entries automatically pruned)
- **Behavior**: Serves from cache when available, fetches and caches new images

## Update Flow

### 1. Service Worker Updates
When new content is deployed:

1. Browser checks for service worker updates every hour (automatic)
2. New service worker enters "installing" state
3. New service worker downloads and caches updated static assets
4. New service worker enters "waiting" state
5. User is notified via update notification banner

### 2. User-Initiated Update
When user clicks "Update Now" button:

1. User action triggers `skipWaiting()` on new service worker
2. New service worker takes control immediately
3. Page automatically reloads with fresh content
4. Old caches are deleted during activation phase

### 3. Automatic Cache Refresh
- Service worker checks for updates every 60 minutes
- `updateViaCache: 'none'` ensures service worker file is never cached
- Fresh content is fetched in background for stale-while-revalidate resources

## Update Notification UI

Users see a friendly notification when updates are available:

```
┌─────────────────────────────────────┐
│ 🔄 Update Available                 │
│                                     │
│ A new version of Hzel Brown is     │
│ available with the latest content   │
│ and improvements.                   │
│                                     │
│ [Update Now] [Later] [×]           │
└─────────────────────────────────────┘
```

- **Update Now**: Applies update immediately and reloads page
- **Later**: Dismisses notification, update applies on next page reload
- **×**: Dismisses notification, same as "Later"

## Cache Version Management

The cache version (`CACHE_VERSION`) is incremented when:
- PWA functionality changes
- Static assets need to be refreshed
- Service worker logic updates

Old caches are automatically cleaned up during the activation phase.

## API/Data Freshness

API requests and CMS content use a network-first strategy:
- Always attempts to fetch fresh data from network
- Falls back to cached data if network is unavailable
- Cache is updated with fresh data on successful network requests

## Offline Support

When network is unavailable:
1. Static pages serve from static cache
2. Dynamic content serves from dynamic cache
3. Images serve from image cache
4. API requests serve from dynamic cache
5. Uncached resources show "Offline" message

## Manual Cache Clear

Users can manually clear the cache by:
1. Opening browser settings
2. Navigating to site settings
3. Clearing storage/cache for the site
4. Reloading the page

## Testing Cache Invalidation

To test cache updates locally:

1. **Deploy changes**: Make code changes and deploy
2. **Update version**: Increment `CACHE_VERSION` in `public/sw.js`
3. **Test in installed PWA**: 
   - Wait up to 1 hour for automatic check, or
   - Close and reopen the PWA to trigger update check
4. **Verify notification**: Update notification should appear
5. **Verify update**: Click "Update Now" and verify fresh content loads

## Developer Notes

### Incrementing Cache Version
```javascript
// In public/sw.js
const CACHE_VERSION = 'v3'; // Increment this number
```

### Forcing Immediate Update (Development)
```javascript
// In browser console
navigator.serviceWorker.ready.then(registration => {
  registration.update();
});
```

### Viewing Cached Resources
Use Chrome DevTools:
1. Open DevTools → Application tab
2. Navigate to Cache Storage
3. View cached resources by cache name

## Best Practices

1. **Always increment cache version** when updating service worker logic
2. **Test offline functionality** after cache changes
3. **Monitor cache sizes** to ensure they don't grow unbounded
4. **Update service worker** sparingly to avoid frequent user notifications
5. **Test cross-browser** as PWA support varies by browser

## Browser Compatibility

- **Chrome/Edge**: Full support with update notifications
- **Firefox**: Full support with update notifications  
- **Safari iOS**: Full support, manual installation process
- **Safari macOS**: Basic PWA support

## Additional Resources

- [MDN: Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Web.dev: Service Worker Lifecycle](https://web.dev/service-worker-lifecycle/)
- [Web.dev: Offline Cookbook](https://web.dev/offline-cookbook/)
