// &Lorem — shows a phone notification when a real user writes to you, even when the app is closed.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));

self.addEventListener('push', e => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch (x) { d = { body: e.data ? e.data.text() : '' }; }
  e.waitUntil(self.registration.showNotification(d.title || '&Lorem', {
    body: d.body || 'You have a new message',
    icon: 'icon.png',
    badge: 'icon.png',
    tag: d.chat || 'lorem',
    renotify: true,
    data: { chat: d.chat || '' },
  }));
});

// tap the notification: open the app on that chat
self.addEventListener('notificationclick', e => {
  e.notification.close();
  const chat = (e.notification.data && e.notification.data.chat) || '';
  e.waitUntil((async () => {
    const wins = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const w of wins) {
      w.postMessage({ open: chat });
      if ('focus' in w) return w.focus();
    }
    return self.clients.openWindow('./' + (chat ? '#chat=' + encodeURIComponent(chat) : ''));
  })());
});
