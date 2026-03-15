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

// אזעקה ברקע — שלח הודעה לכל לשוניות פתוחות ותציג push
messaging.onBackgroundMessage(function(payload) {
    const title = payload.notification?.title || '🚨 צבע אדום!';
    const body  = payload.notification?.body  || 'אזעקה באזורך — היכנס למרחב מוגן';

    // הודע לכל לשוניות פתוחות לפתוח את הכפתורים
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(windowClients) {
        windowClients.forEach(function(client) {
            client.postMessage({ type: 'NEW_ALERT' });
        });
    });

    // הצג push notification (ללא קול מותאם — קול מערכת בלבד)
    return self.registration.showNotification(title, {
        body: body,
        icon: '/icons/icon-192.png',
        badge: '/icons/icon-72.png',
        vibrate: [400, 100, 400, 100, 400],
        requireInteraction: true,
        tag: 'safezone-alert',
        renotify: true,
        dir: 'rtl',
        lang: 'he',
        // כפתורי פעולה — עובד ב-Android, לא נתמך ב-iOS
        actions: [
            { action: 'safe',  title: '✅ אני בטוח' },
            { action: 'onway', title: '🚗 אני בדרך' },
            { action: 'help',  title: '🆘 זקוק לעזרה' }
        ],
        data: payload.data || {}
    });
});

// לחיצה על הנוטיפיקציה או כפתורי הפעולה
self.addEventListener('notificationclick', function(event) {
    event.notification.close();

    const action = event.action;
    let url;

    if (action === 'safe')       url = '/?status=safe';
    else if (action === 'onway') url = '/?status=onway';
    else if (action === 'help')  url = '/?status=help';
    else                         url = '/?alert=1'; // לחיצה על גוף ההתראה — פתח ותן לבחור

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(windowClients) {
            // אם האפליקציה כבר פתוחה — נווט אליה
            for (const client of windowClients) {
                if ('focus' in client) {
                    client.navigate(url);
                    return client.focus();
                }
            }
            // פתח חלון חדש
            if (clients.openWindow) return clients.openWindow(url);
        })
    );
});

self.addEventListener('activate', function(event) {
    event.waitUntil(clients.claim());
});
