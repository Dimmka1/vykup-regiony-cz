const CACHE_NAME = "vykup-shell-v2";
const SHELL_URLS = ["/", "/kraje", "/offline"];
const OFFLINE_URL = "/offline";
const SYNC_TAG = "lead-form-sync";
const DB_NAME = "vykup-offline-leads";
const STORE_NAME = "pending-leads";

/* ── IndexedDB helpers ───────────────────────────────────────── */

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, {
          keyPath: "id",
          autoIncrement: true,
        });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function getAllPendingLeads() {
  return openDB().then(
    (db) =>
      new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readonly");
        const store = tx.objectStore(STORE_NAME);
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      }),
  );
}

function deleteLead(db, id) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const req = store.delete(id);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

/* ── Replay queued leads ─────────────────────────────────────── */

async function replayLeads() {
  const db = await openDB();
  const leads = await getAllPendingLeads();
  let syncedCount = 0;

  for (const lead of leads) {
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lead.payload),
      });
      if (res.ok) {
        await deleteLead(db, lead.id);
        syncedCount++;
      }
    } catch {
      break;
    }
  }

  if (syncedCount > 0) {
    const clients = await self.clients.matchAll({ type: "window" });
    clients.forEach((client) => {
      client.postMessage({ type: "LEADS_SYNCED", count: syncedCount });
    });
  }
}

/* ── Install ─────────────────────────────────────────────────── */

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_URLS)),
  );
  self.skipWaiting();
});

/* ── Activate ────────────────────────────────────────────────── */

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)),
      ),
    ),
  );
  self.clients.claim();
});

/* ── Fetch — network-first for navigations, cache assets ───── */

self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Cache static assets with stale-while-revalidate
  if (
    request.destination === "style" ||
    request.destination === "script" ||
    request.destination === "image" ||
    request.destination === "font"
  ) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) =>
        cache.match(request).then((cached) => {
          const fetched = fetch(request).then((response) => {
            if (response.ok) {
              cache.put(request, response.clone());
            }
            return response;
          });
          return cached || fetched;
        }),
      ),
    );
    return;
  }

  // Navigation — network-first, fallback to cache then offline page
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          return response;
        })
        .catch(() =>
          caches
            .match(request)
            .then((cached) => cached || caches.match(OFFLINE_URL)),
        ),
    );
    return;
  }
});

/* ── Background Sync ─────────────────────────────────────────── */

self.addEventListener("sync", (event) => {
  if (event.tag === SYNC_TAG) {
    event.waitUntil(replayLeads());
  }
});

/* ── Message handler (for manual sync trigger) ───────────────── */

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "REPLAY_LEADS") {
    event.waitUntil(replayLeads());
  }
});
