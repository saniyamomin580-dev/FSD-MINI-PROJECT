const HttpError = require('../utils/HttpError');
const { asyncHandler } = require('../middleware/errorHandler');

// POST /api/auth/login   body: { "password": "..." }
exports.login = asyncHandler(async (req, res) => {
  if (!process.env.ADMIN_KEY) throw new HttpError(500, 'ADMIN_KEY is not set in server/.env');
  if (req.body.password !== process.env.ADMIN_KEY) throw new HttpError(401, 'Wrong admin password.');
  res.status(200).json({ message: 'Login successful.' });
});
