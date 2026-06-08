// Ein simpler Service Worker, der die strengen Android/Chrome-Regeln erfüllt, 
// damit der "Installieren"-Banner getriggert wird.

self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  console.log('Stadtrallye Service Worker ist aktiv.');
});

// Wichtig für Chrome: Ein Fetch-Event muss vorhanden sein.
// Wir lassen hier einfach alle normalen Internet-Anfragen durch.
self.addEventListener('fetch', (e) => {
  // Kein echtes Offline-Caching, da wir immer die aktuellen Datenbank-Einträge brauchen
  return; 
});
