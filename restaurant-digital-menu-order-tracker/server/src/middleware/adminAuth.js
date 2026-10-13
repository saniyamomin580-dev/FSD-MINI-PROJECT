// Demo admin protection: the admin sends the password in the "x-admin-key" header.
// The password lives only in server/.env (never in the database or the code).
const HttpError = require('../utils/HttpError');

module.exports = function adminAuth(req, res, next) {
  const expected = process.env.ADMIN_KEY;
  if (!expected) return next(new HttpError(500, 'ADMIN_KEY is not set in server/.env'));
  if (req.header('x-admin-key') !== expected) {
    return next(new HttpError(401, 'Admin login required.'));
  }
  next();
};
