
const CACHE_NAME = 'offline-cache-v1';
const urlsToCache = [
  // App
  'index.js',
  'ServiceWorker.js',

  '/agenda',
  '/requests',
  '/history',

  'app/agenda/agenda.html',
  'app/agenda/AgendaController.js',
  'app/agenda/AgendaHistoryController.js',
  'app/common/AgendaService.js',
  'app/common/ApiService.js',
  'app/common/AuthService.js',
  'app/common/ErrorHandler.js',
  'app/requests/RequestsController.js',
  'app/app.js',
  'app/config.js',
  'app/index.html',
  'app/manifest.json',

  // Style
  'css/style.css',

  // Images
  'images/',

  // Libs
  'node_modules/angular/angular.min.js',
  'node_modules/angular-route/angular-route.min.js',
  'node_modules/angular-cookies/angular-cookies.min.js',
  'node_modules/angular-messages/angular-messages.min.js',
  'node_modules/angular-animate/angular-animate.min.js',
  'node_modules/angular-aria/angular-aria.min.js',
  'node_modules/angular-material/angular-material.min.js',
  'node_modules/angular-material-data-table/dist/md-data-table.min.js',
  'node_modules/angular-material-data-table/dist/md-data-table.min.css',
  'node_modules/moment/min/moment.min.js',
  'app/libs/moment/locale/pt-br.js',
  'node_modules/angular-moment/angular-moment.min.js',
  'node_modules/ngmap/build/scripts/ng-map.min.js',
];

self.addEventListener('install', (event) => {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Caching...");
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) console.log(`Obtained from cache: ${event.request}`);
      return response || fetch(event.request);
    })
  );
});
