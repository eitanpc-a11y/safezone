// ============================================================
// Firebase Messaging Service Worker
// קובץ זה חייב להיות בשם firebase-messaging-sw.js
// ולהיות בתיקיית השורש של הפרויקט
// ============================================================

importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyDLKF30weC2z70WvK3zvDoOqIVWYfoQ9ow",
    authDomain: "safezone-cd4b5.firebaseapp.com",
    projectId: "safezone-cd4b5",
    storageBucket: "safezone-cd4b5.appspot.com",
    messagingSenderId: "78949340231",
    appId: "1:78949340231:web:85929f70752f1fc7cf8d62"
});

const messaging = firebase.messaging();

// טיפול בהתראות שמגיעות כשהאפליקציה ברקע
messaging.onBackgroundMessage((payload) => {
    console.log('[SW] התראה ברקע:', payload);

    const title = payload.notification?.title || "🚨 SafeZone Alert";
    const body  = payload.notification?.body  || "בדוק את האפליקציה";
    const type  = payload.data?.type || 'unknown';

    const options = {
        body: body,
        icon: 'https://cdn-icons-png.flaticon.com/512/564/564619.png',
        badge: 'https://cdn-icons-png.flaticon.com/512/564/564619.png',
        vibrate: type === 'red_alert' ? [500, 100, 500, 100, 500] : [200, 100, 200],
        requireInteraction: type === 'red_alert', // השאר נוטיפיקציית צבע אדום על המסך עד לאישור
        data: {
            url: './index.html',
            type: type
        },
        actions: type === 'red_alert' ? [
            { action: 'open', title: 'פתח SafeZone' }
        ] : []
    };

    return self.registration.showNotification(title, options);
});

// טיפול בלחיצה על הנוטיפיקציה
self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    const url = event.notification.data?.url || './index.html';

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            // אם האפליקציה כבר פתוחה — עבור אליה
            for (const client of clientList) {
                if (client.url.includes('index.html') && 'focus' in client) {
                    return client.focus();
                }
            }
            // אחרת — פתח חלון חדש
            if (clients.openWindow) {
                return clients.openWindow(url);
            }
        })
    );
});
