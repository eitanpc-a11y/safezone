// Service Worker רגיל — גיבוי לטיפול בהתראות
// הקובץ הראשי לניהול התראות הוא firebase-messaging-sw.js

self.addEventListener('push', function(event) {
    if (!event.data) return;

    let data;
    try {
        data = event.data.json();
    } catch (e) {
        data = { title: 'SafeZone', body: event.data.text() };
    }

    const options = {
        body: data.body || 'התראה חדשה',
        icon: 'https://cdn-icons-png.flaticon.com/512/564/564619.png',
        vibrate: [500, 100, 500],
        data: { url: '/index.html' }
    };

    event.waitUntil(
        self.registration.showNotification(data.title || 'SafeZone', options)
    );
});

self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    event.waitUntil(
        clients.openWindow(event.notification.data?.url || '/index.html')
    );
});
