importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyDLKF30weC2z70WvK3zvDoOqIVWYfoQ9ow",
  projectId: "safezone-cd4b5",
  messagingSenderId: "78949340231",
  appId: "1:78949340231:web:85929f70752f1fc7cf8d62"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: 'https://cdn-icons-png.flaticon.com/512/564/564619.png',
    vibrate: [500, 100, 500],
    data: { url: './index.html?alert=true' }
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});
