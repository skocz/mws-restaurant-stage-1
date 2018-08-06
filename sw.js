const staticCacheName = 'restaurant-cache-1';

let urlCache = [
        './index.html',
        './js/dbhelper.js',
        './js/main.js',
        'restaurant.html',
        './js/restaurant_info.js',
        './css/styles.css',
        './data/restaurants.json',
        './img/*'
];


self.addEventListener('install', function(event) {

  event.waitUntil(
    caches.open(staticCacheName).then(function (cache) {
      console.log(cache);
      return cache.addAll(urlCache);

    }).catch(erroe => {
      console.log(erroe);
    })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function (cacheName) {
          return cacheName.startsWith('restaurant-') &&
            cacheName != staticCacheName;
        }).map(function (cacheName){
            return caches.delete(cacheName);
        })
      );
    })
  );
});

self.addEventListener('fetch', function(event){
  event.respondWith(
    caches.match(event.request).then(function(response){
      return response || fetch(event.request);
    })
    );
});

