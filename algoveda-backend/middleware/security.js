// Security headers middleware
const securityHeaders = (req, res, next) => {
  // Prevent click-jacking
  res.setHeader('X-Frame-Options', 'DENY');

  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // Enable XSS protection
  res.setHeader('X-XSS-Protection', '1; mode=block');

  // Referrer policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Content security policy (basic)
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"
  );

  next();
};

// Input sanitization
const sanitizeInput = (req, res, next) => {
  const sanitize = (str) => {
    if (typeof str !== 'string') return str;
    return str.replace(/[<>]/g, '');
  };

  // Sanitize query parameters
  Object.keys(req.query).forEach((key) => {
    if (typeof req.query[key] === 'string') {
      req.query[key] = sanitize(req.query[key]);
    }
  });

  // Sanitize body parameters
  if (req.body && typeof req.body === 'object') {
    const sanitizeObj = (obj) => {
      Object.keys(obj).forEach((key) => {
        if (typeof obj[key] === 'string') {
          obj[key] = sanitize(obj[key]);
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
          sanitizeObj(obj[key]);
        }
      });
    };
    sanitizeObj(req.body);
  }

  next();
};

// Validate JSON payload size
const validatePayloadSize = (limit = '10kb') => {
  return (req, res, next) => {
    const maxSize = parseSize(limit);
    const contentLength = parseInt(req.headers['content-length'], 10);

    if (contentLength > maxSize) {
      return res.status(413).json({
        message: 'Payload too large',
        maxSize: limit,
      });
    }

    next();
  };
};

// Helper to parse size strings
const parseSize = (sizeStr) => {
  const units = {
    b: 1,
    kb: 1024,
    mb: 1024 * 1024,
    gb: 1024 * 1024 * 1024,
  };

  const match = sizeStr.toLowerCase().match(/^(\d+)(b|kb|mb|gb)$/);
  if (!match) return 10 * 1024; // Default 10KB

  return parseInt(match[1]) * (units[match[2]] || 1);
};

module.exports = {
  securityHeaders,
  sanitizeInput,
  validatePayloadSize,
};
