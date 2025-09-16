addEventListener("install", event => {
  event.waitUntil(
  (async () => {
    // Update pre cached items (if changhed)
    var cache = await caches.open(cacheName);
    for (var i = 0; i < precachingItems.length; i++) {
      var preCacheItem = precachingItems[i];
      preCacheItem.url = absoluteUrl(preCacheItem.url);
      var cacheItem = await cache.match(preCacheItem.url);
      if (cacheItem)
        await cache.delete(cacheItem);
      if (!cacheItem || cacheItem.headers.get("last-modified") !== preCacheItem.lastModified)
        await addToCache(cache, preCacheItem);
//        await cache.add(preCacheItem.url);
    }
    //
    await skipWaiting();
  })())
});

addEventListener("activate", event => {
  event.waitUntil((async () => {
    // Remove obsolete cached items
    var cache = await caches.open(cacheName);
    var keys = await cache.keys();
    for (var i = 0; i < keys.length; i++) {
      var request = keys[i];
      var preCacheItem = isPreCached(request);
      if (!preCacheItem)
        await cache.delete(request);
    }
    //
    await clients.claim();
  })());
});

addEventListener("fetch", event => {
  var request = event.request;
  if (request.method !== "GET")
    return;
  //
  // Skip request of not prechaded items
  if (isPreCached(request))
    event.respondWith(caches.match(request));
});

function isPreCached(request) {
  return precachingItems.find(item => item.url === request.url);
}

function absoluteUrl(relativeUrl) {
  var path;
  if (relativeUrl.startsWith("?"))
    path = location.pathname + relativeUrl;
  else
    path = location.pathname.split("/").slice(0, -1).join("/") + "/" + relativeUrl;
  return location.origin + path;
}

async function addToCache(cache, item) {
  var res = await fetch(item.url);
  //
  // Recreate a Response object from scratch to put
  // it in the cache, adding the lastModified header
  const data = {
    status: res.status,
    statusText: res.statusText,
    headers: Object.assign({"last-modified": item.lastModified}, res.headers)
  };
  var body = await res.clone().blob();
  // Put the duplicated Response in the cache
  cache.put(item.url, new Response(body, data));
}