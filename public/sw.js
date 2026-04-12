// ============================================================
// SERVICE WORKER — Hilbert PWA
// Gère : cache offline, notifications push (V2)
// ============================================================

const CACHE_NAME = "hilbert-v1.0-mvp";
const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/manifest.json",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
];

// --- Installation ---
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// --- Activation + nettoyage anciens caches ---
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// --- Stratégie fetch : Network First avec fallback cache ---
self.addEventListener("fetch", (event) => {
  // Ne pas intercepter les requêtes non-GET
  if (event.request.method !== "GET") return;

  // Ne pas intercepter les requêtes Supabase (toujours réseau)
  if (event.request.url.includes("supabase.co")) return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Mettre en cache les réponses valides
        if (response && response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // Fallback : servir depuis le cache
        return caches.match(event.request).then((cached) => {
          return cached || caches.match("/index.html");
        });
      })
  );
});

// --- Notifications Push (V2 — Supabase Edge Functions) ---
// API V2: POST /api/push/subscribe — enregistrement subscription
self.addEventListener("push", (event) => {
  if (!event.data) return;

  const data = event.data.json();
  const options = {
    body: data.message || "",
    icon: "/icons/icon-192x192.png",
    badge: "/icons/icon-72x72.png",
    tag: data.tag || "hilbert-notification",
    data: { url: data.url || "/" },
    actions: [
      { action: "open", title: "Voir" },
      { action: "close", title: "Fermer" },
    ],
  };

  event.waitUntil(
    self.registration.showNotification(data.title || "Hilbert WM", options)
  );
});

// --- Clic sur notification ---
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.action === "close") return;

  const url = event.notification.data?.url || "/";
  event.waitUntil(
    clients.matchAll({ type: "window" }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === url && "focus" in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});
