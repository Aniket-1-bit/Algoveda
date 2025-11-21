const errorHandler = (err, req, res, next) => {
  console.error(err);

  if (err.message === 'Invalid or expired token') {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }

  if (err.message.includes('duplicate key')) {
    return res.status(409).json({ message: 'Resource already exists' });
  }

  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {},
  });
};

module.exports = errorHandler;
