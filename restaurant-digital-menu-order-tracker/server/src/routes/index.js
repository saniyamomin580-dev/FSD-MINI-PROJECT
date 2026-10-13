const router = require('express').Router();
const adminAuth = require('../middleware/adminAuth');
const dashboard = require('../controllers/dashboardController');
const auth = require('../controllers/authController');

router.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));
router.post('/auth/login', auth.login);
router.use('/categories', require('./categoryRoutes'));
router.use('/menu', require('./menuRoutes'));
router.use('/orders', require('./orderRoutes'));
router.get('/dashboard/stats', adminAuth, dashboard.getStats);
router.get('/reports/daily-sales', adminAuth, dashboard.getDailySales);

module.exports = router;
