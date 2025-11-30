const express = require('express');
const { createProduct, listProducts, getProduct } = require('../controllers/productController');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', auth, createProduct);
router.get('/', listProducts);
router.get('/:id', getProduct);

module.exports = router;