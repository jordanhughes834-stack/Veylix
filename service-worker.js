// Bump this on every deploy that changes a cached file - it's the only
// thing that forces old caches to evict (stale-while-revalidate otherwise
// keeps serving the previous version indefinitely).
var CACHE_VERSION = "veylix-v1";

var SHELL_FILES = [
  // Both "./" and "./index.html" are cached: a navigation request to the
  // site root ("https://.../repo/") and a request for "index.html" are
  // distinct cache keys even though the server returns the same bytes for
  // both, so caching only one would miss the other on lookup.
  "./",
  "./index.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
  "./apple-touch-icon.png"
];

self.addEventListener("install", function(event){
  event.waitUntil(
    caches.open(CACHE_VERSION).then(function(cache){
      return cache.addAll(SHELL_FILES);
    })
  );
});

self.addEventListener("activate", function(event){
  event.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(keys.filter(function(k){ return k !== CACHE_VERSION; }).map(function(k){
        return caches.delete(k);
      }));
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", function(event){
  var req = event.request;
  if(req.method !== "GET") return;

  var url = new URL(req.url);
  // Never intercept cross-origin calls (Supabase REST/Auth, the supabase-js
  // CDN script) - those must always hit the network, not the app-shell cache.
  if(url.origin !== self.location.origin) return;

  event.respondWith(
    caches.open(CACHE_VERSION).then(function(cache){
      return cache.match(req).then(function(cached){
        var network = fetch(req).then(function(resp){
          if(resp && resp.ok) cache.put(req, resp.clone());
          return resp;
        }).catch(function(){ return cached; });
        return cached || network;
      });
    })
  );
});
