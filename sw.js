const CACHE = 'espelho-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&display=swap'
];

// Instala e faz cache dos assets essenciais
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

// Remove caches antigos quando atualizar
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Estratégia: network first, fallback para cache
// Garante que o usuário sempre receba a versão mais recente quando online
self.addEventListener('fetch', e => {
  // Não intercepta chamadas à API da Anthropic
  if (e.request.url.includes('api.anthropic.com')) return;

  e.respondWith(
    fetch(e.request)
      .then(res => {
        // Atualiza o cache com a resposta mais recente
        if (res && res.status === 200 && res.type === 'basic') {
          const clone = res.clone();
          caches.open(CACHE).then(cache => cache.put(e.request, clone));
        }
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
