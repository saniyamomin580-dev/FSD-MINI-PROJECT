const router = require('express').Router();
const c = require('../controllers/orderController');
const adminAuth = require('../middleware/adminAuth');

router.post('/', c.create); // customers place orders
router.get('/', adminAuth, c.getAll); // admin lists/filter orders
router.get('/:id', c.getOne); // customers track by order ID
router.patch('/:id/status', adminAuth, c.updateStatus);

module.exports = router;
