// Migration worker: retire the old cache-first PWA permanently.
// AND redirect old deployment URLs to production domain.

const PRODUCTION_DOMAIN = 'sher-e-punjab-menu-app.vercel.app';

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names.map((name) => caches.delete(name)));
    await self.registration.unregister();
    const clients = await self.clients.matchAll({ type: 'window' });
    for (const client of clients) {
      // Check if client is on old deployment URL
      const clientUrl = new URL(client.url);
      if (clientUrl.hostname !== PRODUCTION_DOMAIN && clientUrl.hostname.includes('vercel.app')) {
        // Redirect to production domain
        const newUrl = `https://${PRODUCTION_DOMAIN}${clientUrl.pathname}${clientUrl.search}${clientUrl.hash}`;
        client.navigate(newUrl);
      } else {
        client.navigate(client.url);
      }
    }
  })());
});

// Intercept all fetch requests and redirect if on old deployment
self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url);
  
  // If request is to old deployment domain, redirect to production
  if (requestUrl.hostname !== PRODUCTION_DOMAIN && requestUrl.hostname.includes('vercel.app')) {
    const productionUrl = `https://${PRODUCTION_DOMAIN}${requestUrl.pathname}${requestUrl.search}${requestUrl.hash}`;
    event.respondWith(Response.redirect(productionUrl, 301));
    return;
  }
  
  // Otherwise, let the request pass through
  event.respondWith(fetch(event.request));
});
