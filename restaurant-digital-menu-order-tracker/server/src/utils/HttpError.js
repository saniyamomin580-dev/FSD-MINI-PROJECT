// An error that carries an HTTP status code (e.g. 400, 404, 409).
class HttpError extends Error {
  constructor(status, message, details) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

module.exports = HttpError;
