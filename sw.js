const CACHE_NAME = 'bp-app-v5'; // 關鍵：版本號改成 v5
const urlsToCache = [
  './index.html',
  './manifest.json',
  './icon.svg'
];

// 安裝時下載新檔案，並強制立即接管
self.addEventListener('install', event => {
  self.skipWaiting(); 
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// 啟動時清除所有舊版本的快取記憶
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('刪除舊快取:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim()) // 立即控制手機畫面
  );
});

// 抓取檔案時優先使用快取，沒有才透過網路抓
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});