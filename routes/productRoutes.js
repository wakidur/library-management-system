const router = require('express').Router();
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');

//Invoked middleware.
const advanceResults = require('../middleware/advancedResults');
const { protect } = require('../config/protect');
const { authorize } = require('../config/authorization');

//Product model
const Product = require('../models/productModel');

router
  .route('/')
  .get(advanceResults(Product), getProducts)
  .post(protect, authorize('admin'), createProduct);

router
  .route('/:productId')
  .get(getProduct)
  .put(protect, authorize('admin'), updateProduct)
  .delete(protect, authorize('admin'), deleteProduct);

module.exports = router;
