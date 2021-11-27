const staticCacheName = 'site-static';
const dynamicCacheName = 'site-dynamic-v1';
const assets = [
   
  '/',
  '/index.html',
  
  '/js/app.js',
  '/css/styles.css',
  '/js/app.js',
  '/assets/img/profile.jpg',
  'https://fonts.googleapis.com/css?family=Saira+Extra+Condensed:500,700',
   'https://fonts.googleapis.com/css?family=Muli:400,400i,800,800i',
  
];

// install event
self.addEventListener('install', evt => {
  //console.log('service worker installed');
  evt.waitUntil(
    caches.open(staticCacheName).then((cache) => {
      console.log('caching shell assets');
      cache.addAll(assets);
    })
  );
});

self.addEventListener('activate', evt => {
    //console.log('service worker activated');
    evt.waitUntil(
      caches.keys().then(keys => {
        //console.log(keys);
        return Promise.all(keys
          .filter(key => key !== staticCacheName && key !== dynamicCacheName)
          .map(key => caches.delete(key))
        );
      })
    );
  });
  
  // fetch event
  self.addEventListener('fetch', evt => {
    //console.log('fetch event', evt);
    evt.respondWith(
      caches.match(evt.request).then(cacheRes => {
        return cacheRes || fetch(evt.request).then(fetchRes => {
          return caches.open(dynamicCacheName).then(cache => {
            cache.put(evt.request.url, fetchRes.clone());
            return fetchRes;
          })
        });
      })
    );
  });