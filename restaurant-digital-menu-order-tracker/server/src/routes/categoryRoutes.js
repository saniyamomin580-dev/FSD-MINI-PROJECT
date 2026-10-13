const router = require('express').Router();
const c = require('../controllers/categoryController');
const adminAuth = require('../middleware/adminAuth');

router.get('/', c.getAll);
router.get('/:id', c.getOne);
router.post('/', adminAuth, c.create);
router.put('/:id', adminAuth, c.update);
router.delete('/:id', adminAuth, c.remove);

module.exports = router;
