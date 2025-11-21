// Simple in-memory rate limiter
class RateLimiter {
  constructor() {
    this.requests = new Map();
  }

  check(identifier, limit = 100, windowSeconds = 60) {
    const now = Date.now();
    const windowMs = windowSeconds * 1000;

    if (!this.requests.has(identifier)) {
      this.requests.set(identifier, []);
    }

    const timestamps = this.requests.get(identifier);

    // Remove old requests outside the window
    const validTimestamps = timestamps.filter((ts) => now - ts < windowMs);
    this.requests.set(identifier, validTimestamps);

    if (validTimestamps.length >= limit) {
      return false;
    }

    validTimestamps.push(now);
    return true;
  }

  cleanup() {
    // Clean up old entries every 5 minutes
    setInterval(() => {
      const now = Date.now();
      for (const [key, timestamps] of this.requests.entries()) {
        const validTimestamps = timestamps.filter((ts) => now - ts < 3600000); // 1 hour
        if (validTimestamps.length === 0) {
          this.requests.delete(key);
        } else {
          this.requests.set(key, validTimestamps);
        }
      }
    }, 300000);
  }
}

const limiter = new RateLimiter();
limiter.cleanup();

// Middleware factory
const createRateLimiter = (limit = 100, windowSeconds = 60) => {
  return (req, res, next) => {
    const identifier = req.user?.id || req.ip;
    const allowed = limiter.check(identifier, limit, windowSeconds);

    res.set('X-RateLimit-Limit', limit);
    res.set('X-RateLimit-Remaining', limit - (limiter.requests.get(identifier)?.length || 0));

    if (!allowed) {
      return res.status(429).json({
        message: 'Too many requests, please try again later',
        retryAfter: windowSeconds,
      });
    }

    next();
  };
};

module.exports = createRateLimiter;
