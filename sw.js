// Service Worker minimalista — apenas instala e não intercepta nenhum fetch
// Isso evita qualquer interferência com chamadas à API externa

const CACHE = 'espelho-v4';

self.addEventListener('install', e => {
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  // Remove todos os caches antigos
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// SEM listener de fetch — o browser trata tudo diretamente
// Isso garante que api.anthropic.com nunca seja interceptado
