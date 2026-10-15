self.addEventListener("install", () => {
  console.log("✅ Service Worker Installed");
});

self.addEventListener("activate", () => {
  console.log("✅ Service Worker Activated");
});

self.addEventListener("push", function (event) {
  let data = {};

  if (event.data) {
    data = event.data.json();
  }

  self.registration.showNotification(data.title || "New Booking 🔔", {
    body: data.message || "You received a new booking",
    icon: "https://cdn-icons-png.flaticon.com/512/1827/1827392.png",

    badge: "https://cdn-icons-png.flaticon.com/512/1827/1827392.png",

    vibrate: [200, 100, 200],

    requireInteraction: true,
  });
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();

  event.waitUntil(clients.openWindow("/admin/bookings"));
});
