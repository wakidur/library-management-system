const router = require('express').Router();
const {
  getOrders,
  getOrder,
  createOrder,
  updateOrder,
  deleteOrder,
} = require('../controllers/orderController');

//Invoked middleware.
const advanceResults = require('../middleware/advancedResults');
const { protect } = require('../config/protect');
const { authorize } = require('../config/authorization');

//Product model
const Order = require('../models/orderModel');

router.use(protect);

router
  .route('/')
  .get(
    authorize('admin'),
    advanceResults(Order, [
      {
        path: 'userId',
        select: 'uid phone role',
      },
      {
        path: 'promoCodeId',
        select: 'discountRate useTime promoCode',
      },
    ]),
    getOrders
  )
  .post(authorize('user', 'admin'), createOrder);

router.route('/:orderId').get(getOrder).put(updateOrder).delete(deleteOrder);

module.exports = router;
