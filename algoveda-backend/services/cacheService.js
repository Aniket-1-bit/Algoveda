// In-memory cache service (lightweight alternative to Redis)
class CacheService {
  constructor() {
    this.cache = new Map();
    this.timers = new Map();
  }

  set(key, value, ttlSeconds = 300) {
    // Clear existing timer if any
    if (this.timers.has(key)) {
      clearTimeout(this.timers.get(key));
    }

    // Store value
    this.cache.set(key, {
      value,
      timestamp: Date.now(),
      ttl: ttlSeconds * 1000,
    });

    // Set expiration timer
    const timer = setTimeout(() => {
      this.cache.delete(key);
      this.timers.delete(key);
    }, ttlSeconds * 1000);

    this.timers.set(key, timer);
  }

  get(key) {
    if (!this.cache.has(key)) {
      return null;
    }

    const cached = this.cache.get(key);
    const age = Date.now() - cached.timestamp;

    // Check if expired
    if (age > cached.ttl) {
      this.cache.delete(key);
      this.timers.delete(key);
      return null;
    }

    return cached.value;
  }

  has(key) {
    return this.get(key) !== null;
  }

  delete(key) {
    if (this.timers.has(key)) {
      clearTimeout(this.timers.get(key));
      this.timers.delete(key);
    }
    this.cache.delete(key);
  }

  clear() {
    this.timers.forEach((timer) => clearTimeout(timer));
    this.timers.clear();
    this.cache.clear();
  }

  // Invalidate cache by pattern
  invalidatePattern(pattern) {
    const regex = new RegExp(pattern);
    const keysToDelete = Array.from(this.cache.keys()).filter((key) => regex.test(key));

    keysToDelete.forEach((key) => {
      this.delete(key);
    });
  }

  // Get cache stats
  getStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
      memory: Math.round(
        (JSON.stringify(Array.from(this.cache.entries())).length * 2) / 1024
      ) + ' KB',
    };
  }
}

module.exports = new CacheService();
