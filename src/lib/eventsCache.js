// Простий кеш в пам'яті для подій
const eventsCache = new Map();
const EVENTS_CACHE_TTL = 5 * 60 * 1000; // 5 хвилин

function getCachedEvents(key) {
  const cached = eventsCache.get(key);
  if (cached && Date.now() - cached.timestamp < EVENTS_CACHE_TTL) {
    return cached.data;
  }
  return null;
}

function setCachedEvents(key, data) {
  eventsCache.set(key, {
    data,
    timestamp: Date.now()
  });
}

function clearEventsCache() {
  eventsCache.clear();
  console.log('🗑️ Events cache cleared');
}

module.exports = {
  getCachedEvents,
  setCachedEvents,
  clearEventsCache
};

