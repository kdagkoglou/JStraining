/*
  service worker
*/

// configuration
'use strict';

const
  version = '1.0.0',
  CACHE = version + '::testsite',
  offlineURL = 'offline.html',
  installFilesEssential = [
    'index.html',
    'manifest.json',
    'css/main.css',
    'js/main.js',
    'js/offline.js'
  ].concat(offlineURL);


// installation event
self.addEventListener('install', event => {

  console.log('service worker: install');

  // cache core files
  event.waitUntil(
    installStaticFiles()
      .then(() => self.skipWaiting())
  );

});


// install static assets
function installStaticFiles() {

  return caches.open(CACHE)
    .then(cache => {

      // cache essential files
      return cache.addAll(installFilesEssential);

    });

}


// activation event
self.addEventListener('activate', event => {

  console.log('service worker: activate');

  // delete old caches
  event.waitUntil(
    clearOldCaches()
      .then(() => self.clients.claim())
  );

});


// clear old caches
function clearOldCaches() {

  return caches.keys()
    .then(keylist => {

      return Promise.all(
        keylist
          .filter(key => key !== CACHE)
          .map(key => caches.delete(key))
      );

    });

}


// application fetch network data
self.addEventListener('fetch', event => {

  // abandon non-GET requests
  if (event.request.method !== 'GET') return;

  let url = event.request.url;

  event.respondWith(

    caches.open(CACHE)
      .then(cache => {

        return cache.match(event.request)
          .then(response => {

            if (response) {
              // return cached file
              console.log('cache fetch:', url);
              return response;
            }

            // make network request
            return fetch(event.request)
              .then(newreq => {

                console.log('network fetch:', url);
                if (newreq && newreq.ok) {
                  cache.put(event.request, newreq.clone());
                }

                return newreq;

              })
              // app is offline
              .catch(() => {

                // return offline page
                console.log(event.request);
                return caches.match(offlineURL);

              });

          });

      })

  );

});
