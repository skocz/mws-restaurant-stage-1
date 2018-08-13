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
      console.log('opened cache');
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
            if (response) {
                    return response; 
            }
//      return response || fetch(event.request);
             var fetchRequest = event.request.clone();
            
            return fetch(fetchRequest).then(
                    function(response) {
                             // Check if we received a valid response
                            if(!response || response.status !== 200 || response.type !== 'basic') {
                                    return response;
                            }
                            
                            var responseToCache = response.clone();
                            
                            caches.open(staticCacheName)
                            .then(function(cache) {
                                    cache.put(event.request, responseToCache);
                            });
                            return response; 
                    }
                    );

                 })
        );
});


