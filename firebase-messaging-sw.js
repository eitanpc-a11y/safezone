importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

// מפתחות מעודכנים וזהים ל-index.html
firebase.initializeApp({
  apiKey: "gyKZFrNtLB3we67OY8_iohg6h9TtmRBlpMP1bj1DY_k",
  projectId: "safezone-cd4b5",
  messagingSenderId: "78949340231",
  appId: "1:78949340231:web:85929f70752f1fc7cf8d62"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('הודעה התקבלה ברקע:', payload);
  const notificationTitle = payload.notification.title || "SafeZone Alert";
  const notificationOptions = {
    body: payload.notification.body,
    icon: 'https://cdn-icons-png.flaticon.com/512/564/564619.png',
    vibrate: [500, 100, 500],
    data: { url: './index.html' }
  };
  return self.registration.showNotification(notificationTitle, notificationOptions);
});
