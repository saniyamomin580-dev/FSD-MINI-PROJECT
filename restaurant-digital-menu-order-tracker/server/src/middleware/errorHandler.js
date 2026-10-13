const HttpError = require('../utils/HttpError');

const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

function notFound(req, res, next) {
  next(new HttpError(404, `Route not found: ${req.method} ${req.originalUrl}`));
}

// Turns any error into a clean JSON response.
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({ message: 'Validation failed', errors: err.errors.map((e) => e.message) });
  }
  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({ message: 'That value already exists.', errors: err.errors.map((e) => e.message) });
  }
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    return res.status(409).json({ message: 'This record is linked to other records, or the linked record does not exist.' });
  }
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'Request body is not valid JSON.' });
  }
  const status = err.status || 500;
  if (status === 500) console.error(err);
  res.status(status).json({
    message: status === 500 ? 'Something went wrong on the server.' : err.message,
    ...(err.details ? { errors: err.details } : {}),
  });
}

module.exports = { asyncHandler, notFound, errorHandler };
