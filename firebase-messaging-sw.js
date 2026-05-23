// Import the background messaging scripts
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyAR7BTzvAftYn4QYLXxL5N8wKm5Fz7zw9I",
  authDomain: "its-robiul-project.firebaseapp.com",
  projectId: "its-robiul-project",
  storageBucket: "its-robiul-project.firebasestorage.app",
  messagingSenderId: "67384048870",
  appId: "1:673848048870:web:8e6acaf6d156a4e0cecf27"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Handle background notifications seamlessly
messaging.onBackgroundMessage((payload) => {
  console.log('[Background System Packet Received]: ', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/assets/logo.png', // Swap out for your studio logo path later
    data: { url: payload.data.url || '/community.html' }
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Auto-redirect user straight to the community page when they click the notification card
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});