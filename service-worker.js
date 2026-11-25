// Bump this on every deploy that changes a cached file - it's the only
// thing that forces old caches to evict.
var CACHE_VERSION = "veylix-v2";

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
  self.skipWaiting(); // activate immediately instead of waiting for every
                       // open tab/home-screen instance to fully close first -
                       // on iOS a standalone PWA can sit "waiting" indefinitely
                       // otherwise, so updates never reach the home screen icon.
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
  self.clients.claim(); // take control of already-open pages right away
});

self.addEventListener("fetch", function(event){
  var req = event.request;
  if(req.method !== "GET") return;

  var url = new URL(req.url);
  // Never intercept cross-origin calls (Supabase REST/Auth, the supabase-js
  // CDN script) - those must always hit the network, not the app-shell cache.
  if(url.origin !== self.location.origin) return;

  // The HTML document itself: always prefer the network so a fresh deploy
  // shows up on the very next load, falling back to cache only when
  // there's genuinely no connection (the whole point of the service worker).
  if(req.mode === "navigate" || url.pathname.endsWith("/index.html")){
    event.respondWith(
      fetch(req).then(function(resp){
        if(resp && resp.ok){
          caches.open(CACHE_VERSION).then(function(cache){ cache.put(req, resp.clone()); });
        }
        return resp;
      }).catch(function(){
        return caches.open(CACHE_VERSION).then(function(cache){ return cache.match(req); });
      })
    );
    return;
  }

  // Everything else (manifest/icons): cache-first, refreshing in the
  // background - these rarely change and benefit from instant load.
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
