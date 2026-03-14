// טעינת הספריות של פיירבייס לתוך ה-Service Worker
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

// הגדרות הפרויקט שלך (זהה ל-index.html)
firebase.initializeApp({
  apiKey: "AIzaSyDLKF30weC2z70WvK3zvDoOqIVWYfoQ9ow",
  projectId: "safezone-cd4b5",
  messagingSenderId: "78949340231",
  appId: "1:78949340231:web:85929f70752f1fc7cf8d62"
});

const messaging = firebase.messaging();

// טיפול בהודעות שמגיעות כשהאפליקציה סגורה או ברקע
messaging.onBackgroundMessage((payload) => {
  console.log('התקבלה הודעת Push ברקע:', payload);

  const notificationTitle = payload.notification.title || "התראת SafeZone";
  const notificationOptions = {
    body: payload.notification.body || "יש עדכון חדש במערכת",
    icon: 'https://cdn-icons-png.flaticon.com/512/564/564619.png', // אייקון המגן
    badge: 'https://cdn-icons-png.flaticon.com/512/564/564619.png',
    vibrate: [500, 110, 500, 110, 450], // תבנית רטט חזקה
    data: {
      url: './index.html?alert=true' // הקישור שייפתח בלחיצה
    }
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// מה קורה כשלוחצים על ההתראה בווילון ההתראות
self.addEventListener('notificationclick', function(event) {
  event.notification.close(); // סגירת ההתראה

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
      // אם האפליקציה כבר פתוחה, פשוט תעבור אליה
      for (let client of clientList) {
        if (client.url.includes('index.html') && 'focus' in client) {
          return client.focus();
        }
      }
      // אם היא סגורה, תפתח אותה
      if (clients.openWindow) {
        return clients.openWindow('./index.html?alert=true');
      }
    })
  );
});
